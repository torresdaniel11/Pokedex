import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from 'src/app/models/pokemon';
import { BattleService } from 'src/app/services/battle.service';
import { delay, take } from 'rxjs/operators';
import { Move } from 'src/app/models/move';
import { NamedAPIResource } from 'src/app/models/named-apiresource';
import { BattleStates } from '../../../enum/battle-states.enum'
import { AttackStates } from 'src/app/enum/attack-states.enum';
@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  animations: [
    trigger('OpponentEnter', [
      state('flyIn', style({ transform: 'translateX(-5%)' })),
      transition(':enter', [
        style({ transform: 'translateX(-300px)' }),
        animate('1s 700ms ease-out')
      ])
    ]),
    trigger('MyEntrance', [
      state('myEntrance', style({ transform: 'translateX(5%)' })),
      transition(':enter', [
        style({ transform: 'translateX(300px)' }),
        animate('1s 700ms ease-out')
      ])
    ]),
    trigger('opponentAnimation', [
      state('opponentAnim', style({})),
      transition('*=>receive', animate('1500ms 1700ms', keyframes([
        style({ opacity: 1, transform: '', offset: 0 }),
        style({ opacity: 0, transform: '', offset: 0.2 }),
        style({ opacity: 1, transform: '', offset: 0.25 }),
        style({ opacity: 0, transform: '', offset: 0.45 }),
        style({ opacity: 1, transform: '', offset: 0.5 }),
        style({ opacity: 0, transform: '', offset: 0.7 }),
        style({ opacity: 1, transform: '', offset: 0.75 }),
        style({ opacity: 0, transform: '', offset: 0.95 }),
        style({ opacity: 1, transform: '', offset: 1.0 })
      ]))),
      transition('*=>attack', animate('1500ms 0ms', keyframes([
        style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
        style({ opacity: 1, transform: 'translateX(3%)', offset: 0.2 }),
        style({ opacity: 1, transform: 'translateX(6%)', offset: 0.3 }),
        style({ opacity: 1, transform: 'translateX(9%)', offset: 0.4 }),
        style({ opacity: 1, transform: 'translateX(12%)', offset: 0.5 }),
        style({ opacity: 1, transform: 'translateX(16%)', offset: 0.6 }),
        style({ opacity: 1, transform: 'translateX(20%)', offset: 0.7 }),
        style({ opacity: 1, transform: 'translateX(25%)', offset: 0.9 }),
        style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
      ]))),
      state('defeated', style({ opacity: 0 })),
      transition('*=>defeated', animate('1500ms 2300ms'))
    ]),
    trigger('myAnimation', [
      state('myAnim', style({})),
      transition('*=>receive', animate('1500ms 1700ms', keyframes([
        style({ opacity: 1, transform: '', offset: 0 }),
        style({ opacity: 0, transform: '', offset: 0.2 }),
        style({ opacity: 1, transform: '', offset: 0.25 }),
        style({ opacity: 0, transform: '', offset: 0.45 }),
        style({ opacity: 1, transform: '', offset: 0.5 }),
        style({ opacity: 0, transform: '', offset: 0.7 }),
        style({ opacity: 1, transform: '', offset: 0.75 }),
        style({ opacity: 0, transform: '', offset: 0.95 }),
        style({ opacity: 1, transform: '', offset: 1.0 })
      ]))),
      transition('*=>attack', animate('1500ms 0ms', keyframes([
        style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
        style({ opacity: 1, transform: 'translateX(-3%)', offset: 0.2 }),
        style({ opacity: 1, transform: 'translateX(-6%)', offset: 0.3 }),
        style({ opacity: 1, transform: 'translateX(-9%)', offset: 0.4 }),
        style({ opacity: 1, transform: 'translateX(-12%)', offset: 0.5 }),
        style({ opacity: 1, transform: 'translateX(-16%)', offset: 0.6 }),
        style({ opacity: 1, transform: 'translateX(-20%)', offset: 0.7 }),
        style({ opacity: 1, transform: 'translateX(-25%)', offset: 0.9 }),
        style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
      ]))),
      state('defeated', style({ opacity: 0 })),
      transition('*=>defeated', animate('1500ms 2300ms'))
    ]),
  ]
})
export class BattleComponent implements OnInit, OnDestroy {
  private sub: any;

  myPokemonId: string;
  myPokemon: Pokemon;
  myMoves: Move[];
  opponentPokemonId: string;
  opponentPokemon: Pokemon;
  opponentMoves: Move[];

  battleStep: number;
  myLife: number;
  opponentLife: number

  opponentAnim: string;
  myAnim: string;

  lastAttack: string;
  attackAudio: any;

  @ViewChild('battleSound') audioPlayerRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private battleService: BattleService,
    private router: Router) {
    this.myLife = 200;
    this.opponentLife = 200;
    this.battleStep = BattleStates.OPEN_DIALOG_1;
    this.myAnim = AttackStates.NONE
    this.opponentAnim = AttackStates.NONE
  }

  ngOnInit() {
    this.playAudio()
    this.attackAudio = new Audio();
    this.attackAudio.src = "./assets/hit.mp3";
    this.attackAudio.load();
    this.sub = this.route.params.subscribe(params => {
      this.myPokemonId = params['myPokemon'];
      this.opponentPokemonId = params['opponentPokemon'];
      let myPromise = this.fetchPokemon(this.myPokemonId)
      let opponentPromise = this.fetchPokemon(this.opponentPokemonId)
      Promise.all([myPromise, opponentPromise]).then(([myResult, opponentResult]) => {
        this.myPokemon = myResult[0];
        this.myMoves = myResult[1];
        this.opponentPokemon = opponentResult[0];
        this.opponentMoves = opponentResult[1];
        this.setBattleStep(BattleStates.OPEN_DIALOG_1)
      })
    });
  }


  ngOnDestroy() {
    this.audioPlayerRef.nativeElement.pause()
    this.sub.unsubscribe();
  }

  async fetchPokemon(id: string): Promise<any> {
    let pokemon = await this.getPokemon(id)
    let moves = await this.getMoves(pokemon.moves.slice(0, 4).map(el => el.move))
    return Promise.resolve([pokemon, moves])
  }

  getPokemon(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.battleService.getPokemonById(id)
        .pipe(
          delay(500),
          take(1)
        ).subscribe(res => {
          resolve(res)
        })
    })
  }

  getMoves(movesUrl: NamedAPIResource[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.battleService.getMoves(movesUrl)
        .pipe(
          take(1)
        ).subscribe(res => {
          resolve(res)
        })
    })
  }

  setBattleStep(step: number): void {
    this.battleStep = step;
    this.battleLogic()
  }

  battleLogic() {
    if (this.battleStep == BattleStates.OPEN_DIALOG_1) {
      setTimeout(() => this.setBattleStep(BattleStates.OPEN_DIALOG_2), 3500)
    }
    else if (this.battleStep == BattleStates.OPEN_DIALOG_2) {
      setTimeout(() => this.setBattleStep(BattleStates.CHOOSE_MOVE), 3500)
    }
    else if (this.battleStep == BattleStates.MY_ATTACK_CONFIRM) {
      setTimeout(() => this.setBattleStep(BattleStates.OPPONENT_CHOOSE_ATTACK), 2700)
    }
    else if (this.battleStep == BattleStates.OPPONENT_CHOOSE_ATTACK) {
      setTimeout(() => { this.enemyMove() }, 1200)
    }
    else if (this.battleStep == BattleStates.OPPONENT_ATTACK_CONFIRM) {
      setTimeout(() => this.setBattleStep(BattleStates.CHOOSE_MOVE), 3500)
    }
    else if (this.battleStep == BattleStates.MY_ATTACK_MISSED) {
      setTimeout(() => this.setBattleStep(BattleStates.OPPONENT_CHOOSE_ATTACK), 1700)
    }
    else if (this.battleStep == BattleStates.OPPONENT_ATTACK_MISSED) {
      setTimeout(() => this.setBattleStep(BattleStates.CHOOSE_MOVE), 1700)
    }
    else if (this.battleStep == BattleStates.OPPONENT_WIN) {
      this.defeated()
      setTimeout(() => this.setBattleStep(BattleStates.CLOSE_DIALOG), 2300)
    }
    else if (this.battleStep == BattleStates.I_WIN) {
      this.opponentDefeated()
      setTimeout(() => this.setBattleStep(BattleStates.CLOSE_DIALOG), 2300)
    }
  }

  useMove(move: Move) {
    this.lastAttack = move.name;
    let attack = this.battleService.myAttackTurn(move);
    if (attack.didHit) {
      let newLife = Math.max(this.opponentLife - attack.power, 0);
      this.myAttackSucceeded();
      setTimeout(() => { this.opponentLife = newLife }, 2000)
      let nextState = newLife == 0 ? BattleStates.I_WIN : BattleStates.MY_ATTACK_CONFIRM
      this.setBattleStep(nextState)
    } else {
      this.failedAttack()
      this.setBattleStep(BattleStates.MY_ATTACK_MISSED)
    }
  }

  enemyMove() {
    let attack = this.battleService.opponentAttackTurn(this.opponentMoves)
    this.lastAttack = attack.move.name;
    if (attack.didHit) {
      let newLife = Math.max(this.myLife - attack.power, 0);
      this.opponentAttackSucceeded()
      setTimeout(() => { this.myLife = newLife; }, 2000)
      let nextState = newLife == 0 ? BattleStates.OPPONENT_WIN : BattleStates.OPPONENT_ATTACK_CONFIRM
      this.setBattleStep(nextState)
    } else {
      this.failedAttack()
      this.setBattleStep(BattleStates.OPPONENT_ATTACK_MISSED)
    }
  }

  failedAttack() {
    this.opponentAnim = AttackStates.NONE;
    this.myAnim = AttackStates.NONE;
  }

  opponentAttackSucceeded() {
    this.playAudioAttack()
    this.opponentAnim = AttackStates.ATTACK;
    this.myAnim = AttackStates.RECEIVE;
  }

  myAttackSucceeded() {
    this.playAudioAttack()
    this.opponentAnim = AttackStates.RECEIVE;
    this.myAnim = AttackStates.ATTACK;
  }

  opponentDefeated() {
    this.opponentAnim = AttackStates.DEFEATED;
  }

  defeated() {
    this.myAnim = AttackStates.DEFEATED;
  }

  playAudioAttack() {
    setTimeout(() => {
      this.attackAudio.play();
    }, 1400)
  }

  playAudio() {
    this.audioPlayerRef.nativeElement.volume = 0.5;
    this.audioPlayerRef.nativeElement.play();
  }

  restart() {
    this.myLife = 200;
    this.opponentLife = 200;
    this.setBattleStep(BattleStates.OPEN_DIALOG_1);
    this.opponentAnim = AttackStates.NONE;
    this.myAnim = AttackStates.NONE;
  }

  randomPokemon() {
    const random = Math.floor(Math.random() * 150) + 1;
    this.router.navigate(['battle', random, 'vs', this.opponentPokemonId])
    this.restart()
  }

  randomOpponent() {
    const random = Math.floor(Math.random() * 150) + 1;
    this.router.navigate(['battle', this.myPokemonId, 'vs', random])
    this.restart()
  }

  randomBoth() {
    const random1 = Math.floor(Math.random() * 150) + 1;
    const random2 = Math.floor(Math.random() * 150) + 1;
    this.router.navigate(['battle', random1, 'vs', random2])
    this.restart()
  }

}
