using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Predictor.DataAccess;
using Predictor.Model;
using System.Data.Entity;

namespace Predictor.Business
{
    public class PredictionBiz
    {
        private PredictorEntities  _dbContext;

        public PredictionBiz() {
            _dbContext = new PredictorEntities();
        }

        private TimeZoneInfo GetThaiTimeZone() {
            return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        }

        private DateTime GetThaiCurrentDateTime() {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, GetThaiTimeZone());
        }

        private DateTime GetThaiTodayNoonUTC() {
            return GetThaiCurrentDateTime().Date.AddHours(12).ToUniversalTime();
        }

        private List<DateTime> GetAvailableMatchTimeAfterNoon() {
            DateTime noonToday = GetThaiTodayNoonUTC();

            return _dbContext.Matches
                             .Where(m => m.MatchStartTime >= noonToday && m.Tournament.IsActive)
                             .Select(m => m.MatchStartTime)
                             .ToList();
        }

        private DateTime GetPredictableTimeFrom(DateTime cutOffTime) {
            return DateTime.UtcNow < cutOffTime ? DateTime.UtcNow : TimeZoneInfo.ConvertTimeFromUtc(cutOffTime.AddDays(1), GetThaiTimeZone()).Date.AddHours(12).ToUniversalTime();
        }

        public List<PredictScoreModel> GetPredictableMatchs(string userId)
        {
            List<PredictScoreModel> result = new List<PredictScoreModel>();

            List<DateTime> availableMatchTime = GetAvailableMatchTimeAfterNoon();

            if (availableMatchTime.Count() > 0) {
                DateTime cutOffTime = availableMatchTime.Min(); //first match after noon

                DateTime predictableTimeFrom = GetPredictableTimeFrom(cutOffTime);

                result = (_dbContext.Matches
                                    .Where(m => m.MatchStartTime > predictableTimeFrom && m.Tournament.IsActive)
                                    .Select(m => new PredictScoreModel() {
                                        TournamentName = m.Tournament.Name,
                                        NationCodeHome = m.Nation1.Code,
                                        NationNameHome = m.Nation1.Name,
                                        NationFlagHome = m.Nation1.FlagClass,
                                        NationCodeAway = m.Nation.Code,
                                        NationNameAway = m.Nation.Name,
                                        NationFlagAway = m.Nation.FlagClass,
                                        MatchId = m.Id,
                                        MatchStartTime = m.MatchStartTime,
                                        Remark = m.Remark
                                    })).ToList();

                List<Prediction> predictions = _dbContext.Predictions.Where(p => p.UserId == userId && p.Match.MatchStartTime > predictableTimeFrom).ToList();

                for (int i = 0; i < result.Count; i++) {
                    Prediction predicted = predictions.Where(p => p.MatchId == result[i].MatchId).FirstOrDefault();

                    if (predicted != null) {
                        result[i].ScoreHome = predicted.ScoreHome;
                        result[i].ScoreAway = predicted.ScoreAway;
                        result[i].UseMissile = predicted.UseMissile;
                        result[i].Comment = predicted.Comment;
                    }
                }
            }

            return result;

        }
    }
}
