import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Evolution, PokemonDetails } from 'src/app/shared/interfaces';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {

  public pokemon!: PokemonDetails;
  public evolutions: Evolution[] = [];
  public isLoading = false;
  public faArrowDown = faArrowDown;
  public faArrowUp = faArrowUp;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  async ngOnInit() {
    const pokemonName = this.activatedRoute.snapshot.params['name']; 
    await this.getPokemonDetails(pokemonName);
  }

  async getPokemonDetails( name: string ) {
    this.isLoading = true;
    this.pokemonService.getDetails(name).subscribe(
      data => {
        this.pokemonService.getSpecies(data.species.url).subscribe(
          speciesData => {
            this.pokemonService.getEvolutionChain(speciesData.evolution_chain.url).subscribe(
              evolutionData => {
                const moves = data['moves'];
                const abilities = data['abilities'];
                
                const evolutionChain = evolutionData['chain'];

                if (evolutionChain.evolves_to?.length > 0) {
                  this.getEvolutions(evolutionChain);
                }
                
                this.pokemon = {
                  name: data.name,
                  displayName: data.name[0].toUpperCase() + data.name.substring(1),
                  imageUrl: data.sprites.front_default,
                  moves: moves.map( (item: any) => item.move.name[0].toUpperCase() + item.move.name.substring(1) ),
                  height: data.height / 10,
                  weight: data.weight / 10,
                  exp: data.base_experience,
                  abilities: abilities.map((item: any) => item.ability.name[0].toUpperCase() + item.ability.name.substring(1)),
                }
                this.isLoading = false;
              }
            )
          }
        )
        
      }
    )
  }

  async getEvolutions(evolutionChain: any) {
    const details = await firstValueFrom(this.pokemonService.getDetails(evolutionChain.species.name))
    this.evolutions.push({
      name: evolutionChain.species.name,
      displayName: evolutionChain.species.name[0].toUpperCase() + evolutionChain.species.name.substring(1),
      imageUrl: details.sprites.front_default,
      minLevel: !evolutionChain.evolution_details?.length ? 1 : evolutionChain.evolution_details[0].min_level,
      trigger: !evolutionChain.evolution_details?.length ? null : evolutionChain.evolution_details[0].trigger.name,
    })
    if (evolutionChain.evolves_to?.length > 0) {
      this.getEvolutions(evolutionChain.evolves_to[0]);
    }
  }

  onEvolutionClick( evolution: Evolution) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['/pokemon', evolution.name])
  }
}
