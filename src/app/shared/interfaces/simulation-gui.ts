export interface SimulationGUI {
    name: string,
    parameters: Array<SimulationParameter<any>>
}

export interface SimulationParameter <T>{
    label: string,
    id: string;
    value: T,
    input: TypeSimulationInput,
    options?: T[]
    button: TypeSimulationButton
}

export type TypeSimulationInput = 'text' | 'select' | 'number' | 'date';

export type TypeSimulationButton = 'load' | null;
