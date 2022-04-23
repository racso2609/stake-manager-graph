import { BigInt } from "@graphprotocol/graph-ts";
import {
  StakeManager,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StakeCreation,
} from "../generated/StakeManager/StakeManager";
import {
  User,
  AdminRole,
  Stake,
  RevokedAdmin,
  Token,
} from "../generated/schema";

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = AdminRole.load(event.params.role.toHex());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new AdminRole(event.params.role.toHex());

    // Entity fields can be set using simple assignments
    entity.newAdminRole = event.params.newAdminRole;
  }

  // BigInt and BigDecimal math are supported
  entity.newAdminRole = event.params.newAdminRole;

  // Entity fields can be set based on event parameters
  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;

  // Entities can be written to the store with `.save()`
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

  entity.roles.push(event.params.role);
  entity.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStakeCreation(event: StakeCreation): void {}
