import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalDetail } from "../../components/modal-detail/modal-detail";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule, ModalDetail],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  pokemones: any[] = [];
  pokemon: any = null;
  searchId: string = '';
  id: string = '';
  constructor(private pokemonService: PokemonService, private router: Router, private route: ActivatedRoute) { }

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
    const searchTerm = this.searchId.trim();
    const observable = searchTerm
      ? this.pokemonService.listarPokemones(searchTerm)
      : this.pokemonService.listarPokemones();

    observable.subscribe({
      next: (data) => {
        console.log('Pokémon list successfully fetched:', data);
        // Swal.fire({
        //   title: '¡Éxito!',
        //   text: 'Pokémon encontrado',
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // });
      },
      error: (err) => {
   
        console.error('Error fetching Pokémon:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Ocurrió un error al buscar los Pokémon.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        this.searchId = "";
      }
    });
  }

  abrirModal(id: number): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

}
