import axios from 'axios';

let studyGroupInfo = {
  myStudy: [
    {
      title: null,
    },
  ],
};

const setStudyGroupInfo = newStudyGroupInfo => {
  studyGroupInfo = newStudyGroupInfo;
};

const getStudyGroupData = () => ({ ...studyGroupInfo });

const fetchStudyGroupData = user => {
  const { uid: userUid } = user;

  return axios.get(`/posting/${userUid}`);
};

export default { setStudyGroupInfo, fetchStudyGroupData, getStudyGroupData };
