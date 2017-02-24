using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Predictor.Model
{
    public class ScoreModel
    {
        public int RawScore { get; set; }
        public int Score { get; set; }
        public bool useMissile { get; set; }
        public bool missMissile { get; set; }
    }
}
