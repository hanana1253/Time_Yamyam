import { render } from '../view/main';

const state = {
  allGroups: [],
  myGroups: [],
  userData: null,
};

export const getAllGroups = () => state.readyGroups;
export const getMyGroups = () => state.myGroups;

export const setAllGroups = (newGroups, userData) => {
  state.allGroups = newGroups;
  state.userData = userData;
  render.allGroups(state);
};

export const setMyGroups = newMyGroups => {
  state.myGroups = newMyGroups;
  render.myGroups(state.myGroups);
};

export const setUserData = userData => {
  state.userData = userData;
};

export const getUserData = () => state.userData;

export const setAnonymous = render.redirectPage;