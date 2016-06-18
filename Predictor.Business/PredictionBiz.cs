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

        public List<PredictScoreModel> GetPredictableMatchs(string userId)
        {
            List<PredictScoreModel> result = new List<PredictScoreModel>();

            DateTime noonToday = DateTime.Today.AddHours(12);

            IQueryable<DateTime> availableMatchTime = _dbContext.Matches
                                                                .Where(m => m.MatchStartTime >= noonToday && m.Tournament.IsActive)
                                                                .Select(m => m.MatchStartTime);
            if (availableMatchTime.Count() > 0) {
                DateTime cutOffTime = availableMatchTime.Min();

                DateTime predictableTime = DateTime.Now < cutOffTime ? DateTime.Now : cutOffTime.AddDays(1).Date.AddHours(12);

                result = (_dbContext.Matches
                                    .Where(m => m.MatchStartTime > predictableTime && m.Tournament.IsActive)
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

                List<Prediction> predictions = _dbContext.Predictions.Where(p => p.UserId == userId && p.Match.MatchStartTime > predictableTime).ToList();

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
