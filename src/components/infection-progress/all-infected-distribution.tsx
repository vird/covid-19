import React, {useState} from 'react'
import {InfectionStage} from '../../types'
import {DataChart} from './data-chart'
import {InfectionControls, ISimulationData} from './infection-progress-controls'
import {Person} from '../../simulation/person'
import {Simulation} from '../../simulation/simulation'
import {Covid19} from '../../simulation/virus'

export interface AllInfectedDistributionProps {
}

const defaultSimulation: ISimulationData = {
    infectedPopulation: [1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3],
    hospitalBeds: 1e3
}

export const AllInfectedDistribution: React.FC<AllInfectedDistributionProps> = ({ }) => {
    const [simulationData, setSimulationData] = useState<ISimulationData>(defaultSimulation)

    const population = simulationData.infectedPopulation
        .flatMap((amount, group) =>
            Array(amount).fill(group * 10 + 5).map(age => new Person({
                age, infected: true, infectionsStage: InfectionStage.incubation
            }))
        )

    const simulation = new Simulation(population, new Covid19(), simulationData.hospitalBeds)

    const data = []

    for (let day = 0; day < 100; day++) {
        simulation.nextDay();
        data.push({
            total: population.length,
            incubation: population.filter(p => p.infectionsStage === InfectionStage.incubation).length,
            mild: population.filter(p => p.infectionsStage === InfectionStage.mild).length,
            severe: population.filter(p => p.infectionsStage === InfectionStage.severe).length,
            death: population.filter(p => p.infectionsStage === InfectionStage.death).length,
            healed: population.filter(p => p.infectionsStage === InfectionStage.healed).length,
            hospitalBeds: simulation.hospitalBeds
        })
    }

    return (
        <div>
            <h1>Naive Infection Distribution</h1>
            <DataChart data={data}/>
            <InfectionControls simulationData={simulationData} setSimulationData={setSimulationData}    />
        </div>
    )
}