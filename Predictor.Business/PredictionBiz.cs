﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Predictor.DataAccess;
using Predictor.Model;

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
            List<PredictScoreModel> result = (_dbContext.Matches
                                                       .Where(m => m.MatchStartTime > DateTime.Now && m.Tournament.IsActive)
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

            List<Prediction> predictions = _dbContext.Predictions.Where(p => p.UserId == userId && p.Match.MatchStartTime > DateTime.Now).ToList();

            for (int i = 0; i < result.Count; i++) {
                Prediction predicted = predictions.Where(p => p.MatchId == result[i].MatchId).FirstOrDefault();

                if (predicted != null) {
                    result[i].ScoreHome = predicted.ScoreHome;
                    result[i].ScoreAway = predicted.ScoreAway;
                    result[i].UseMissile = predicted.UseMissile;
                    result[i].Comment = predicted.Comment;
                }
            }

            return result;
        }
    }
}
