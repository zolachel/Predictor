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
                <div className="mdl-grid">
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-cell mdl-cell--8-col mdl-card mdl-shadow--4dp" key={node.MatchId}>
                        <div class="mdl-card__title">
                            <h2 class="mdl-card__title-text">{node.MatchStartTimeUTCString}</h2>
                        </div>
                        <dv className="mdl-card__supporting-text mdl-grid">
                            <div className="mdl-cell mdl-cell--6-col">
                                <span className={node.NationFlagHome}></span>{node.NationNameHome}
                            </div>
                            <div className="mdl-cell mdl-cell--6-col">
                                <span className={node.NationFlagAway}></span>{node.NationNameAway}
                            </div>
                        </dv>
                        <div class="mdl-card__actions">
                            <a href="#" class="mdl-button">Read our features</a>
                        </div>
                    </div>
                    <div className="mdl-layout-spacer"></div>
                </div>
            )
        });

        return (
            <div>{ predictableNodes }
            </div>
        )
    }
});

ReactDOM.render(
    <PredictableBox url="/Prediction/GetPredictableMatchs" />,
    document.getElementById('content')
)