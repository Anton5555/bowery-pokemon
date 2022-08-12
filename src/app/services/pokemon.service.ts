import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private url = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) { }

  getPaginatedPokemons(url: string): Observable<any>{
    return this.http.get<any>(url);
  }
  getDetails(name: string): Observable<any>{
    return this.http.get<any>(`${this.url}pokemon/${name}`);
  }
  getEvolutionChain(url: string): Observable<any>{
    return this.http.get<any>(url);
  }

  getSpecies(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

}
