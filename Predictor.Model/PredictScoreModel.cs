using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Predictor.Model
{
    public class PredictScoreModel
    {
        public string TournamentName { get; set; }
        public string NationCodeHome { get; set; }
        public string NationNameHome { get; set; }
        public string NationFlagHome { get; set; }
        public string NationCodeAway { get; set; }
        public string NationNameAway { get; set; }
        public string NationFlagAway { get; set; }
        public int MatchId { get; set; }
        public DateTime MatchStartTime { get; set; }
        public string MatchStartTimeUTCString
        {
            get
            {
                return MatchStartTime.ToString("o") + "Z";
            }
        }
        public string Remark { get; set; }
        public byte? ScoreHome { get; set; }
        public byte? ScoreAway { get; set; }
        public bool UseMissile { get; set; }
        public string Comment { get; set; }
    }
}
