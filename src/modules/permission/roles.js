export const listRoles = [
  'admin',
  'new',  //user registered, but did not confirmed the mail
  'user',
];

const roles = {

  admin: [
    // USER
    'user.auth',
    'user.get.admin',
    'user.delete.admin',
    'user.update.admin',
    'user.search.admin',
    'user.get.all',
    'user.rating',

    // PROPOSAL
    'proposal.create',
    'proposal.delete',
    'proposal.update',
    'proposal.search',
    'proposal.get.all'

  ],

  new: [
    // USER
    'user.auth',

    // PROPOSAL
    'proposal.get.all'
  ],

  user: [
    // USER
    'user.auth',
    'user.get.all',
    'user.rating',

    // PROPOSAL
    'proposal.create',
    'proposal.delete',
    'proposal.update',
    'proposal.search',
    'proposal.get.all'

  ],

};
export default roles;
