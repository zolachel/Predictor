var ScoreTableBox = React.createClass({
    getInitialState: function () {
        return { scoreList: [] };
    },
    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            success: function (data) {
                this.setState({ scoreList: data });
            }.bind(this)
        });
    },
    componentDidUpdate: function() {
        componentHandler.upgradeDom();
    },
    render: function () {
        return (
            <div className="mdl-grid">
                <div className="mdl-layout-spacer"></div>
                <div className="mdl-cell mdl-cell--10-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                    <table className="mdl-data-table mdl-js-data-table width-100-percent">
                        <thead>
                            <tr>
                                <th className="align-center">No.</th>
                                <th className="align-center">Name</th>
                                <th className="align-center">Matchs</th>
                                <th className="align-center">Raw Score</th>
                                <th className="align-center">Calculated Score</th>
                                <th className="align-center">Used Missiles</th>
                                <th className="align-center">Missed Missiles</th>
                            </tr>
                        </thead>
                        <ScoreRowList data={this.state.scoreList} />
                    </table>
                </div>
                <div className="mdl-layout-spacer"></div>
            </div>
        )
    }
});

var ScoreRowList = React.createClass({
    render: function () {
        var rows = this.props.data.map(function (node) {
            return (
                <ScoreRow key={node.UserId}
                        userId={node.UserId}
                        name={node.Name}
                        totalPredicted={node.TotalPredicted}
                        rawScore={node.RawScore}
                        totalScore={node.TotalScore}
                        usedMissile={node.usedMissile}
                        missedMissile={node.MissedMissile}
                        missedMissilePercent={node.MissedMissilePercent} />
            )
        });

        return (
            <tbody>{ rows }</tbody>
        )
    }
});

var ScoreRow = React.createClass({
    render: function () {
        return (
            <tr>
                <td></td>
                <td className="mdl-data-table__cell--non-numeric">{ this.props.name }</td>
                <td>{ this.props.totalPredicted }</td>
                <td>{ this.props.rawScore }</td>
                <td>{ this.props.totalScore }</td>
                <td>{ this.props.usedMissile }</td>
                <td className="mdl-data-table__cell--non-numeric">{ this.props.MissedMissile} ({ this.props.missedMissilePercent }%)</td>
            </tr>
        )
    }
});

ReactDOM.render(
    <ScoreTableBox url="/Prediction/GetScoreTable" />,
    document.getElementById('content')
)