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
    componentDidUpdate: function() {
        componentHandler.upgradeDom();
    },
    render: function () {
        return (
            <PredictableList data={this.state.predictableList } />
        )
}
});

var PredictableList = React.createClass({
    render: function () {
        var predictableNodes = this.props.data.map(function (node) {
            return (
                <div className="mdl-grid" key={node.MatchId}>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-cell mdl-cell--8-col mdl-card mdl-shadow--4dp">
                        <div className="mdl-card__title">
                            <h2 className="mdl-card__title-text">{moment(node.MatchStartTimeUTCString).format(DATETIME_FORMAT)}</h2>
                        </div>
                        <div className="mdl-card__menu">
                            <div className="mdl-layout-spacer"></div>
                            <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--colored">
                                <i className="material-icons">save</i>
                            </button>
                        </div>
                        <dv className="mdl-card__supporting-text mdl-grid">
                            <div className="mdl-cell mdl-cell--4-col align-right">
                                <h5>{node.NationNameHome}<span className={node.NationFlagHome}></span></h5>
                            </div>
                            <div className="mdl-cell mdl-cell--1-col">
                                <div className="mdl-textfield mdl-js-textfield">
                                    <input className="mdl-textfield__input score-textbox" type="text" maxLength="1" pattern="[0-9]" id={"score-home" + node.MatchId}  value={node.ScoreHome} />
                                    <label className="mdl-textfield__label" for={"score-home" + node.MatchId}>score</label>
                                    <span className="mdl-textfield__error">Input is not number</span>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--2-col">
                                <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for={"missile" + node.MatchId}>
                                  <input type="checkbox" id={"missile" + node.MatchId} className="mdl-checkbox__input" checked={node.UseMissile} />
                                  <span className="mdl-checkbox__label">missile</span>
                                </label>
                            </div>
                            <div className="mdl-cell mdl-cell--1-col">
                                <div className="mdl-textfield mdl-js-textfield">
                                    <input className="mdl-textfield__input score-textbox" type="text" maxLength="1" pattern="[0-9]" id={"score-away" + node.MatchId} value={node.ScoreAway} />
                                    <label className="mdl-textfield__label" for={"score-away" + node.MatchId}>score</label>
                                    <span className="mdl-textfield__error">Input is not number</span>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--4-col">
                                <h5><span className={node.NationFlagAway }></span>{node.NationNameAway}</h5>
                            </div>
</dv>
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