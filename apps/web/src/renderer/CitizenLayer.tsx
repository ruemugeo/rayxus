import { CitizenManager } from "../citizens/CitizenManager";

const manager = new CitizenManager();

const CELL = 50;

export default function CitizenLayer(){

    return(

        <>

            {manager.getAll().map(citizen=>(

                <div

                    key={citizen.id}

                    style={{

                        position:"absolute",

                        width:10,

                        height:10,

                        borderRadius:"50%",

                        background:citizen.color,

                        left:citizen.x*CELL+20,

                        top:citizen.y*CELL+20,

                        pointerEvents:"none"

                    }}

                />

            ))}

        </>

    );

}