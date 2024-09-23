import {hash, compare} from 'bcrypt'

export class PasswordService {

    /**
     * Hache le mot de passe en utilisant l'algorithme de hachage bcrypt avec le nombre de tours spécifié.
     *
     * @param {string} data - Le mot de passe à hacher.
     * @returns {Promise<string>} Une promesse résolue avec le mot de passe haché.
     * @throws {Error} Une erreur si la fonction de hachage échoue.
     */
    static async hashPassword(data: string): Promise<string> {
        console.log(process.env.BCRYPT_SALTROUND)
        const hashPwd = await hash(data, parseInt(process.env.BCRYPT_SALTROUND));
        return hashPwd;
    }

    /**
     * Vérifie si le mot de passe en clair correspond au mot de passe haché.
     *
     * @param {string} data - Le mot de passe en clair.
     * @param {string} encrypted - Le mot de passe haché.
     * @returns {Promise<boolean>} Une promesse résolue avec le résultat de la comparaison.
     * @throws {Error} Une erreur si la fonction de comparaison échoue.
     */
    static async comparePassword(data: string, encrypted: string): Promise<boolean> {
        const isMatch = await compare(data, encrypted);
        return isMatch;
    }
}
