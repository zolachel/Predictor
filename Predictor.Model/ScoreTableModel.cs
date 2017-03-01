using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Predictor.Model
{
    public class ScoreTableModel
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public int TotalPredicted { get; set; }
        public int RawScore { get; set; }
        public int TotalScore { get; set; }
        public int UsedMissile { get; set; }
        public int MissedMissile { get; set; }
        public double MissedMissilePercent { get; set; }
    }
}
