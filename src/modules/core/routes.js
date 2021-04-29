import analyticsRouter from '../analytics/analyticsRoutes.js';
import userRouter from '../user/userRoutes.js';
import jobProposalRouter from '../proposal/job/jobProposalRoutes.js';
import performerProposalRouter from '../proposal/performer/performerProposalRoutes.js';

export default function routes(app) {
  app.use('/analytics', analyticsRouter);
  app.use('/user', userRouter);
  app.use('/job', jobProposalRouter);
  app.use('/performer', performerProposalRouter);
}
