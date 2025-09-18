import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule, TitleCasePipe } from '@angular/common';


@Component({
  selector: 'detail',
  imports: [TitleCasePipe, CommonModule, RouterModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {
    pokemon: any;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
  ) { }

  ngOnInit(): void {
    this.getPokemon();
  }

  getPokemon(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pokemonService.buscarPokemonPorId(id)
        .subscribe(
          (data) => {
            this.pokemon = data;
          },
          (error) => {
            console.error('Error al obtener los detalles del Pokémon:', error);
          }
        );
    }
  }

  goBack(): void {
    // this.location.back();
  }

}
