import { ByteArray, Bytes } from "@graphprotocol/graph-ts";
import {
  StakeManager,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StakeCreation,
} from "../generated/StakeManager/StakeManager";
import { User, AdminRole, Stake } from "../generated/schema";

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = AdminRole.load(event.params.role.toHex());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new AdminRole(event.params.role.toHex());
  }

  entity.newAdminRole = event.params.newAdminRole;

  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;

  entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.getRoleAdmin(...)
  // - contract.getStakingToken(...)
  // - contract.hasRole(...)
  // - contract.poolsAmounts(...)
  // - contract.rewardsToken(...)
  // - contract.stakingRewardsGenesis(...)
  // - contract.stakingRewardsTokenInfo(...)
  // - contract.stakingTokens(...)
  // - contract.supportsInterface(...)
}

export function handleRoleGranted(event: RoleGranted): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = User.load(event.params.account.toHex());
  if (!entity) {
    entity = new User(event.params.account.toHex());
  }
  const roles = entity.roles;
  roles.push(event.params.role);
  entity.roles = roles;
  entity.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {
  let entity = User.load(event.params.account.toHex());
  if (!entity) {
    entity = new User(event.params.account.toHex());
  }

  let roles: Bytes[] = [];
  const revokedRole = event.params.role;

  for (let i = 0; i < entity.roles.length; i++) {
    const role: Bytes = entity.roles[i];
    if (entity.roles[i] !== revokedRole) roles.push(role);
  }

  entity.roles = roles;

  entity.save();
}

export function handleStakeCreation(event: StakeCreation): void {
  let entity = Stake.load(event.params.stakingReward.toHex());
  if (!entity) {
    entity = new Stake(event.params.stakingReward.toHex());
  }
  let admin = User.load(event.params.admin.toHex());

  if (!admin) {
    admin = new User(event.params.admin.toHex());
  }
  const stakes = admin.stakes;
  stakes.push(entity.id);
  admin.stakes = stakes;

  entity.admin = admin.id;
  entity.lpToken = event.params.stakingReward.toString();
  entity.save();
  admin.save();
}
