import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  pokemones: any[] = [];
  pokemon: any = null;
  searchId: string = '';
  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemonService.pokemones$.subscribe(data => this.pokemones = data);
    this.pokemonService.pokemon$
    .pipe(filter(p => !!p)) // ignora null
    .subscribe(data => {
      this.pokemon = data;
      console.log('Pokemon cargado:', data);
    });

    // carga inicial
    this.pokemonService.listarPokemones().subscribe();

  }

  cargarMas() {
    this.searchId = "";
    this.pokemonService.listarPokemones().subscribe();
  }

  buscar() {
    if (this.searchId.trim()) {
      this.pokemonService.listarPokemones(this.searchId).subscribe();
    }else{
      this.searchId = "";
      this.pokemonService.listarPokemones().subscribe();
    }
  }

}
