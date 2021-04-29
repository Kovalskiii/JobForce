import PerformerProposal from '../performerProposalModel.js';
import analytics from '../../../analytics/controllers/analytics.js';
import message from '../../../utils/messages.js';

export default async function proposalCreateQuery({
    performerProposalId,
    userId,
    jobProposalId,
    description,
    price,
    res,
}) {
    const performerProposal = new PerformerProposal({
        _id: performerProposalId,
        description,
        approved: false,
        price,
        jobProposalId,
        owner: userId,
    });

    const payload = {
        performerProposalId: performerProposalId,
    };

    return performerProposal
        .save()
        .then(() => {
            analytics('PERFORMER_PROPOSAL_CREATE_SUCCESS', {
                user: userId,
                performerProposalId: performerProposalId,
            });
            return message.success('Job proposal created. Success', payload);
        })
        .catch((error) => {
            const analyticsId = analytics('PERFORMER_PROPOSAL_CREATE_FAIL', {
                error: error.message,
                user: userId,
                query: 'proposalCreateQuery',
            });
            res.status(400).json(message.fail('Creating performer proposal failed. FAIL', analyticsId));
        });
}
