﻿using System;
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

        public int AddOrUpdatePrediction(PredictionModel model) {
            Prediction prediction = _dbContext.Predictions.Where(p => p.MatchId == model.MatchId && p.UserId == model.UserId).FirstOrDefault();

            if (prediction == null) {
                prediction = new Prediction();
                prediction.MatchId = model.MatchId;
                prediction.UserId = model.UserId;
                prediction.ScoreHome = model.ScoreHome;
                prediction.ScoreAway = model.ScoreAway;
                prediction.UseMissile = model.UseMissile;
                prediction.Comment = model.Comment;

                _dbContext.Predictions.Add(prediction);
            } else {
                prediction.ScoreHome = model.ScoreHome;
                prediction.ScoreAway = model.ScoreAway;
                prediction.UseMissile = model.UseMissile;
                prediction.Comment = model.Comment;
            }

            _dbContext.SaveChanges();

            return prediction.Id;
        }

        public List<ScoreTableModel> GetScoreTable() {
            List<ScoreTableModel> scoreTable = new List<ScoreTableModel>();
            ScoreTableModel existingInScoreTable;
            ScoreModel score;
            
            IQueryable<Prediction> predictedMatchs = _dbContext.Predictions.Where(p => p.Match.Tournament.IsActive
                                                                                    && p.Match.MatchStartTime < DateTime.UtcNow
                                                                                    && p.Match.ScoreHome.HasValue && p.Match.ScoreAway.HasValue);

            foreach(Prediction predictedMatch in predictedMatchs) {
                score = GetScore(predictedMatch.Match.ScoreHome.Value, predictedMatch.Match.ScoreAway.Value, predictedMatch.ScoreHome, predictedMatch.ScoreAway, predictedMatch.UseMissile);

                existingInScoreTable = scoreTable.FirstOrDefault(r => r.UserId == predictedMatch.UserId);

                if (existingInScoreTable == null) {
                    existingInScoreTable = new ScoreTableModel() {
                        UserId = predictedMatch.UserId,
                        RawScore = score.RawScore,
                        TotalScore = score.Score,
                        TotalPredicted = 1,
                        UsedMissile = score.useMissile ? 1 : 0,
                        MissedMissile = score.missMissile ? 1 : 0
                    };

                    scoreTable.Add(existingInScoreTable);
                } else {
                    existingInScoreTable.RawScore += score.RawScore;
                    existingInScoreTable.TotalScore += score.Score;
                    existingInScoreTable.TotalPredicted += 1;
                    existingInScoreTable.UsedMissile += score.useMissile ? 1 : 0;
                    existingInScoreTable.MissedMissile += score.missMissile ? 1 : 0;
                }

                existingInScoreTable.MissedMissilePercent = existingInScoreTable.MissedMissile * 100 / existingInScoreTable.MissedMissile;
            }

            return scoreTable;
        }

        private ScoreModel GetScore(byte resultScoreHome, byte resultScoreAway, byte predictedScoreHome, byte predictedScoreAway, bool useMissile) {
            ScoreModel result = new ScoreModel() { Score = 0, RawScore = 0, useMissile = useMissile, missMissile = false };

            if ((resultScoreHome > resultScoreAway && predictedScoreHome > predictedScoreAway) ||
                (resultScoreHome < resultScoreAway && predictedScoreHome < predictedScoreAway) ||
                (resultScoreHome == resultScoreAway && predictedScoreHome == predictedScoreAway)) {

                if (resultScoreHome == predictedScoreHome && resultScoreAway == predictedScoreAway) {
                    if (predictedScoreHome + predictedScoreAway <= 3)
                        result.RawScore = 3;
                    else
                        result.RawScore = 4;
                } else {
                    result.RawScore = 2;
                }

                result.Score = useMissile ? result.RawScore * 2 : result.RawScore;
            } else {
                result.RawScore = 0;
                result.Score = useMissile ? -4 : 0;
                result.missMissile = true;
            }

            return result;
        }
    }
}
