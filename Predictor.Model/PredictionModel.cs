using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Predictor.Model
{
    public class PredictionModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int MatchId { get; set; }
        public byte ScoreHome { get; set; }
        public byte ScoreAway { get; set; }
        public bool UseMissile { get; set; }
        public string Comment { get; set; }
    }
}
