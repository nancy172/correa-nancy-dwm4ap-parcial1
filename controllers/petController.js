import Pet from "../models/PetModel.js";

// Validaciones
const validatePetAge = (age) => {
    const okUnits = ['días', 'meses', 'años'];

    if (age.value <= 0 || typeof age.value !== 'number') {
        throw new Error("ERROR: La edad debe ser un número mayor a 0.");
    }

    if (!okUnits.includes(age.unit)) {
        throw new Error("ERROR: La unidad de edad debe ser 'días', 'meses' o 'años'.");
    }
};

const validatePet = (pet, isUpdate = false) => {
    const okTypes = ['perro', 'gato', 'conejo', 'otro'];
    const okSexes = ['macho', 'hembra'];

    if(!isUpdate || pet.name !== undefined){
        if (!pet.name || typeof pet.name !== 'string' ||  pet.name.trim() === '') {
            throw new Error("ERROR: El nombre de la mascota debe ser un texto y no puede quedar vacío.");
        }
    }

    if(!isUpdate || pet.type !== undefined){
        if( !pet.type || typeof pet.type !== 'string' || !okTypes.includes(pet.type.toLowerCase()) ) {
            throw new Error("ERROR: El tipo de mascota debe ser 'perro', 'gato', 'conejo' u 'otro'.");
        }
    }

    if(!isUpdate || pet.age) {
        validatePetAge(pet.age);
    }

    if(!isUpdate || pet.sex !== undefined) {
        if( !pet.sex || typeof pet.sex !== 'string' || !okSexes.includes(pet.sex.toLowerCase()) ) {
            throw new Error("ERROR: El sexo de la mascota debe ser 'macho' o 'hembra'.");
        }
    }

    if(!isUpdate || pet.description !== undefined){
        if (!pet.description || typeof pet.description !== 'string' ||  pet.description.trim() === '') {
            throw new Error("ERROR: La descripción de la mascota debe ser un texto y no puede quedar vacío.");
        }
    } 

    if(!isUpdate || pet.caretaker !== undefined){
        if (!pet.caretaker || typeof pet.caretaker !== 'string' ||  pet.caretaker.trim() === '') {
            throw new Error("ERROR: El nombre del cuidador debe ser un texto y no puede quedar vacío.");
        }
    }

};

// Controladores
const getPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({msg: 'ERROR: No se pudo obtener la lista de mascotas.'});
    }
    
};

const getPetById = async (req, res) => {
    const id = req.params.id;
    try {
        const pet = await Pet.findById(id);
        if(pet){
            res.status(200).json(pet);
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró la mascota.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo obtener la mascota.'});
    }
    
};

const addPet = async (req, res) => {
    const pet = req.body;

    // Se verifica los parámetros completos
    if(!pet.name || !pet.type ||!pet.age ||!pet.sex ||!pet.description ||!pet.caretaker){
        return res.status(400).json({msg: "ERROR: Faltan completar parámetros."});
    }

    try {
        validatePet(pet);

        const doc = new Pet(pet);
        await doc.save();

        res.status(201).json( {msg: "La mascota fue creada con éxito.", data: doc});   

    } catch (error) {
        res.status(400).json({msg: error.message});
    }
    
};

const deletePet = async (req, res) => {
    const id = req.params.id;
    try {
        const status = await Pet.findByIdAndDelete(id);
        if (status) {
            res.json( {msg: 'La mascota fue eliminada con éxito.'} );
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró la mascota.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo eliminar la mascota.'});
    }
    
};

const updatePet = async (req, res) => {
    const id = req.params.id;
    const pet = req.body;

    try {
        // Primero se verifica si existe
        const petExists = await Pet.findById(id);
        if(!petExists) {
            return res.status(404).json({msg: 'ERROR: La mascota que desea editar no existe.'});
        }

        // Validación para solo lo que se quiere actualizar
        validatePet(pet, true);

        const newPet = await Pet.findByIdAndUpdate(id, pet, {new: true});
        res.json( {msg: 'La mascota fue actualizada con éxito.', data : newPet} );

    } catch (error) {
        res.status(400).json({msg: error.message});
    }

};

const filterPets = async (req, res) => {

    try {

        const {type, sex} = req.query;    // Con query se extraen los valores de los parámetros de la url

        const filter = {};
        
        // Filtro y validación por tipo de mascota:
        if ( type && type.trim() !== ""  ) {
            filter.type = type.toLowerCase(); 
        }

        // Filtro y validación por sexo de la mascota:
        if ( sex && sex.trim() !== "" ) {
            filter.sex = sex.toLowerCase();
        }

        // Se verifica si el objeto filter está vacío
        if (Object.keys(filter).length === 0) {
            return res.status(400).json({ msg: "Filtro inválido. Intente nuevamente." });
        }

        // Se buscan las mascotas filtradas
        const pets = await Pet.find(filter);

        if (pets.length === 0) {
            return res.status(404).json( {msg: "No se encontraron resultados."} );
        }

        res.json( {data: pets} );


    } catch (error) {
        res.status(500).json( {msg: error.message} );
        
    }

};

const searchPetByName = async (req, res) => {
    try {
        const { name } = req.query;    // Se extrae el valor del nombre de la URL

        if (!name) {
            return res.status(400).json({ msg: "El nombre de la mascota es obligatorio para realizar la búsqueda." });
        }

        const pets = await Pet.find({});

        // Se filtra todas las mascotas con el mismo nombre
        const petsFiltered = pets.filter( p => p.name.toLowerCase() === name.toLowerCase() );

        if (petsFiltered.length === 0) {
            return res.status(404).json({ msg: "No se encontraron mascotas con ese nombre." });
        }

        res.json({ data: petsFiltered });

    } catch (error) {
        
        res.status(500).json({ msg: error.message });
    }
};


export {getPets, getPetById, addPet, deletePet, updatePet, filterPets, searchPetByName};