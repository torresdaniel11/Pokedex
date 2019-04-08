import { BattleModule } from './battle.module';

describe('BattleModule', () => {
  let battleModule: BattleModule;

  beforeEach(() => {
    battleModule = new BattleModule();
  });

  it('should create an instance', () => {
    expect(battleModule).toBeTruthy();
  });
});
