var PredictableBox = React.createClass({
    getInitialState: function () {
        return { predictableList: [] };
    },
    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            success: function (data) {
                this.setState({ predictableList: data });
            }.bind(this)
        });
    },
    render: function () {
        return (
            <PredictableList data={this.state.predictableList} />
        )
}
});

var PredictableList = React.createClass({
    render: function () {
        var predictableNodes = this.props.data.map(function (node) {
            return (
                <div className="mdl-grid mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp" key={node.MatchId}>
                    <span className="flag flag-en"></span>
                    <div className="mdl-cell mdl-cell--6-col">{node.NationNameHome}</div>
                    <div className="mdl-cell mdl-cell--6-col">{node.NationNameAway}</div>
                </div>
            )
        });

        return (
            <div>
                { predictableNodes }
            </div>
        )
    }
});

ReactDOM.render(
    <PredictableBox url="/Prediction/GetPredictableMatchs" />,
    document.getElementById('content')
)