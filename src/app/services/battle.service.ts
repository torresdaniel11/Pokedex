import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NamedAPIResource } from '../models/named-apiresource';
import { Move } from '../models/move';
import { AttackInfo } from '../models/attack-info';


@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor(private http: HttpClient) { }

  getPokemonById(id: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  }

  getMoves(moveUrls: NamedAPIResource[]): Observable<any> {
    let response1 = this.http.get(moveUrls[0].url);
    let response2 = this.http.get(moveUrls[1].url);
    let response3 = this.http.get(moveUrls[2].url);
    let response4 = this.http.get(moveUrls[3].url);
    return forkJoin([response1, response2, response3, response4]);
  }

  opponentAttackTurn(moves: Move[]): AttackInfo {
    const sortedMoves = this.sortMovesByPriority(moves);
    const move = this.chooseMove(sortedMoves);
    return this.getAttackInfo(move)
  }

  myAttackTurn(move: Move): AttackInfo {
    return this.getAttackInfo(move)
  }

  getAttackInfo(move: Move): AttackInfo {
    const didHit = this.attackDidHit(move);
    let attackInfo = new AttackInfo();
    attackInfo.didHit = didHit;
    attackInfo.power = didHit ? move.power : 0;
    attackInfo.move = move;
    return attackInfo;
  }

  sortMovesByPriority(moves: Move[]): Move[] {
    let sortedMoves = moves.sort((a, b) => {
      return b.priority - a.priority;
    })
    return sortedMoves;
  }

  chooseMove(moves: Move[]): Move {
    const probability = this.getRandom1to100();
    if (probability < 25) {
      return moves[0];
    } else if (probability < 50) {
      return moves[1];
    } else if (probability < 75) {
      return moves[2];
    } else {
      return moves[3];
    }
  }

  attackDidHit(move: Move): boolean {
    const probability = this.getRandom1to100();
    return move.accuracy >= probability;
  }


  getRandom1to100(): number {
    return Math.floor(Math.random() * 101);
  }

}

export const BATTLE_SERVICE: Array<any> = [
  { provide: BattleService, useClass: BattleService }
]

