import messages from '../utils/messages.js';

export default function errorHandling(app) {
  app.use((req, res) => res.status(404).json(messages.fail('API not found')));

  app.use((error, req, res) => {
    res
      .status(error.status || 500)
      .json(
        messages.fail(
          'Something went wrong',
        ),
      );
  });
}
