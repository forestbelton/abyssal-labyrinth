import { physAttack } from "./data/combat";
import { Game } from "./game";

export class BattleController {
  takeEnemyTurn(game: Game) {
    if (!game.enemy || !game.player) {
      return;
    }

    const action = game.enemy.act(game.player);
    switch (action.type) {
      case "attack":
        const enemyResult = physAttack(game.enemy, game.player, 1);
        const enemyDamage = Math.min(game.player.curHp, enemyResult.damage);
        game.log?.addLogMessage(
          "The ",
          `$m:${game.enemy.info.name}`,
          ` hits for ${enemyDamage} damage.`
        );
        game.player.curHp -= enemyDamage;
        if (game.player.curHp <= 0) {
          game.log?.addLogMessage("$m:You die!");
        }
    }
  }
}
