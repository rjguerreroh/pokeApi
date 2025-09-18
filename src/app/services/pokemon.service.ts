import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonBasic {
  id: number;
  name: string;
  image: string;
}
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
    private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  // Estado con BehaviorSubject
  private pokemonesSubject = new BehaviorSubject<any[]>([]);
  private pokemonSubject = new BehaviorSubject<any | null>(null);

  pokemones$ = this.pokemonesSubject.asObservable();
  pokemon$ = this.pokemonSubject.asObservable();

  // Para manejar el offset de la paginación
  private offset = 0;
  private limit = 30;

  constructor(private http: HttpClient) { }

  /** Listar pokemones iniciales */
  listarPokemones(query?: string | number): Observable<PokemonBasic[]> {
  // 🔎 Si hay query, buscar solo ese pokemon
  if (query) {
    return this.http.get<any>(`${this.apiUrl}/${query}`).pipe(
      map(detail => [{
        id: detail.id,
        name: detail.name,
        image: detail.sprites.front_default
      }] as PokemonBasic[]),
      tap(pokemones => {
        this.pokemonesSubject.next(pokemones);
      })
    );
  }

  // 📋 Si no hay query, listar normal con paginación
  return this.http.get<PokemonListResponse>(`${this.apiUrl}?limit=${this.limit}&offset=${this.offset}`).pipe(
    switchMap(response => {
      const requests = response.results.map(p =>
        this.http.get<any>(p.url).pipe(
          map(detail => ({
            id: detail.id,
            name: detail.name,
            image: detail.sprites.front_default
          } as PokemonBasic))
        )
      );
      return forkJoin(requests);
    }),
    tap(pokemones => {
      const current = this.pokemonesSubject.value;
      this.pokemonesSubject.next([...current, ...pokemones]);
      this.offset += this.limit;
    })
  );
}


  /** Buscar un pokemon por ID o nombre */
  buscarPokemonPorId(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(pokemon => this.pokemonSubject.next(pokemon))
    );
  }

  /** Reiniciar listado */
  resetPokemones() {
    this.offset = 0;
    this.pokemonesSubject.next([]);
  }
}
