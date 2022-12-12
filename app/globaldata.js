let curIndex = 0;
let password = '12345678';
let libraryTitle = [
    'Salon', 'Chambre', 'Salle à manger', 'Cuisine',
    'Salle de bain', 'Extérieur', 'Commercial', 'Porte Principale',
    'Nos Collections de PEINTURE', 'Nos Collections de PAPIER PEINT'
];
let libraryDesc = [
    'appartement privé Paris 16ème', 'catalogue Yves Delorme, photographe Romain Ricard', 'réalisation Les Causeuses, photo Julie Ansiau', 'appartement privé, Paris',
    'appartement privé, Paris', 'devanture showroom MÉRIGUET-CARRÈRE PARIS, Paris 6ème', 'Secret Gallery, photo Michael Benard', 'réalisation Estelle Quilici, photo Cécile Molie'
];

const setPassword = function(newPass) {
    password = newPass;
}

const getPassword = function() {
    return password;
}

const updateTitle = function(idx, value) {
    libraryTitle[idx] = value;
}

const getTitles = function() {
    return libraryTitle;
}

const updateDesc = function(idx, value) {
    libraryDesc[idx] = value;
}

const getDescs = function() {
    return libraryDesc;
}

module.exports = {curIndex, getPassword, setPassword, updateTitle, getTitles, updateDesc, getDescs};