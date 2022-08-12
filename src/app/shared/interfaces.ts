export interface UserInfo {
    email: string,
    password: string
}

export interface Pokemon {
    name: string,
    displayName:string,
    imageUrl: string,
}

export interface PokemonDetails extends Pokemon {
    moves: string[],
    height: number,
    weight: number,
    abilities: string[],
    exp: number
}

export interface Evolution extends Pokemon{
    minLevel: number,
    trigger: string,
}