import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap';

@Component({
  selector: 'modal-detail',
  imports: [],
  templateUrl: './modal-detail.html',
  styleUrl: './modal-detail.css'
})
export class ModalDetail implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription | null = null;
  pokemon: any;
  private modal: Modal | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
  ) {}

  ngOnInit(): void {
    this.getPokemon();
  }

  // After the view has initialized, we can safely access the modal element
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
      // Listen for the 'hidden.bs.modal' event
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.cerrarModal();
      });
      // Show the modal
      this.modal.show();
    }
  }

  getPokemon(): void {
    this.subscription = this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.pokemonService.buscarPokemonPorId(id)
          .subscribe({
            next: (data) => {
              this.pokemon = data;
              // Now that we have the data, show the modal.
              // Note: The modal show logic is moved to ngAfterViewInit for better lifecycle management.
            },
            error: (error) => {
              console.log('Error al cargar el producto', error);
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Clean up the modal listener
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.removeEventListener('hidden.bs.modal', this.cerrarModal);
    }
  }

  cerrarModal(): void {
    // Navigate to the parent route to close the modal and restore the URL
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}