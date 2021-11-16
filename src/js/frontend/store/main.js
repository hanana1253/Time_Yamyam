const state = {
  readyGroups: [],
  myGroups: []
};

export const setReadyGroups = newGroups => {
  state.readyGroups = newGroups;
};

export const setMyGroups = newMyGroups => {
  state.myGroups = newMyGroups;
};