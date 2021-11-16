const loginSchema = {
  email: {
    value: '',
    get isValid() {
      return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(this.value);
    },
    error: '이메일 형식에 맞게 입력해 주세요.',
  },
  password: {
    value: '',
    get isValid() {
      return /^[A-Za-z0-9]{6,12}$/.test(this.value);
    },
    error: '영문 또는 숫자를 6~12자 입력하세요.',
  },
  get isValid() {
    return this.email.isValid && this.password.isValid;
  },
};

const signupSchema = {
  ...loginSchema,
  nickname: {
    value: '',
    get isValid() {
      return !!this.value;
    },
    error: '이름을 입력해 주세요.',
  },
  'confirm-password': {
    value: '',
    get isValid() {
      return signupSchema.password.value === this.value;
    },
    error: '패스워드가 일치하지 않습니다.',
  },
  get isValid() {
    return this.email.isValid && this.nickname.isValid && this.password.isValid && this['confirm-password'].isValid;
  },
};
const newstudySchema = {
  'group-name': {
    value: '',
    get isValid() {
      return this.value.length <= 7 && !!this.value;
    },

    error: '스터디 이름을 입력해주세요',
  },
  'group-introduction': {
    value: '',
    get isValid() {
      return !!this.value;
    },
    error: '스터디 소개를 해주세요',
  },
  'hash-id': {
    value: 0,
    get isValid() {
      return this.value > 20;
    },
    error: '해시태그는 20개까지 입력이 가능합니다',
  },
  'approval-method': {
    value: '',
    get isValid() {
      return !!this.value;
    },
    error: '인증 방법을 입력해주세요',
  },
  'date-checker': {
    value: false,
    get isValid() {
      return this.value;
    },
    error: '1개 이상 선택해주세요',
  },

  get isValid() {
    return (
      this['group-name'].isValid &&
      this['group-introduction'].isValid &&
      this['hash-id'].isValid &&
      this['approval-method'].isValid &&
      this['date-checker'].isValid
    );
  },
};
const postingSchema = {
  'approval-title': {
    value: '',
    get isValid() {
      return !!this.value;
    },
    error: '인증글 제목을 선택해주세요',
  },
};
export { loginSchema, signupSchema, newstudySchema, postingSchema };
