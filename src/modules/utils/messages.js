const messages = {};

messages.success = (text = '', payload, show = false) => {
  const object = {
    message: text,
    success: true,
    fail: false,
    payload,
  };

  if (show) object.show = true;

  return object;
};

messages.fail = (text = '', payload, show = false) => {
  const object = {
    message: text,
    success: false,
    fail: true,
    payload,
  };

  if (show) object.show = true;

  return object;
};

messages.realFail = (text = '', payload, show = false) => {
  const object = {
    message: text,
    success: false,
    fail: true,
    payload,
  };

  if (show) object.show = true;

  return object;
};

export default messages;
