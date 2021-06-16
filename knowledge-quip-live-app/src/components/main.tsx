import React, { Component } from "react";
import { menuActions, Menu } from "../menus";
import { AppData, RootEntity } from "../model/root";

interface MainProps {
  rootRecord: RootEntity;
  menu: Menu;
  isCreation: boolean;
  creationUrl?: string;
}

interface MainState {
  data: AppData;
}
export default class Main extends Component<MainProps, MainState> {
  setupMenuActions_(rootRecord: RootEntity) {
    menuActions.toggleHighlight = () =>
      rootRecord.getActions().onToggleHighlight();
  }

  constructor(props: MainProps) {
    super(props);
    const { rootRecord } = props;
    this.setupMenuActions_(rootRecord);
    const data = rootRecord.getData();
    this.state = { data };
  }

  componentDidMount() {
    // Set up the listener on the rootRecord (RootEntity). The listener
    // will propogate changes to the render() method in this component
    // using setState
    const { rootRecord } = this.props;
    rootRecord.listen(this.refreshData_);
    this.refreshData_();
  }

  componentWillUnmount() {
    const { rootRecord } = this.props;
    rootRecord.unlisten(this.refreshData_);
  }

  /**
   * Update the app state using the RootEntity's AppData.
   * This component will render based on the values of `this.state.data`.
   * This function will set `this.state.data` using the RootEntity's AppData.
   */
  private refreshData_ = () => {
    const { rootRecord, menu } = this.props;
    const data = rootRecord.getData();
    // Update the app menu to reflect most recent app data
    menu.updateToolbar(data);
    this.setState({ data: rootRecord.getData() });
  };

  render() {
    const { data } = this.state;
    const { isHighlighted } = data;
    return (
      <div className="container">
        <div className="flex-box header">
          <div>
            <img src="../../assets/icons/home.png" height="20"></img>
          </div>
          <div className="heading">Search Article</div>
          <div className="new-article-btn">New Article</div>
        </div>
        <div className="body">
          <div className="body-header">
            <select className="select-categories">
              <option value="all">All</option>
              <option value="Recent">Recent</option>
            </select>
            <input
              type="text"
              className="input-article-search"
              placeholder="Search Article"
              onKeyUp={this.handleSearch}
            />
          </div>
        </div>
      </div>
    );
  }

  handleSearch(event) {
    //e.preventDefault();

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    let endpoint =
      "https://knowledgequipliveapp.us-e2.cloudhub.io/api/get/article?SearchKey=" +
      event.target.value;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
}
