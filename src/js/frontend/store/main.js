import { render } from "../view/main";

const state = {
  readyGroups: [],
  myGroups: []
};

export const getReadyGroups = () => state.readyGroups;
export const getMyGroups = () => state.myGroups;

export const setReadyGroups = newGroups => {
  state.readyGroups = newGroups;
  render.allGroups(state.readyGroups);
};

export const setMyGroups = newMyGroups => {
  state.myGroups = newMyGroups;
  render.myGroups(state.myGroups);
};