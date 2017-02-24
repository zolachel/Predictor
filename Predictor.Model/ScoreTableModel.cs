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
        public int usedMissile { get; set; }
        public int missedMissile { get; set; }
        public double missedMissilePercent { get; set; }
    }
}
