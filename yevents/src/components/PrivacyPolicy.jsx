import React from 'react';
import { ShieldCheck, ChevronLeft, Eye, Lock, RefreshCw, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/inscription" className="inline-flex items-center gap-2 text-slate-400 hover:text-ynov transition-colors font-bold uppercase text-[10px] tracking-widest group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au formulaire
            </Link>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="bg-[#0f172a] p-8 sm:p-12 text-white relative overflow-hidden text-center sm:text-left">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ynov/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl backdrop-blur-md flex items-center justify-center mx-auto sm:mx-0 border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-ynov" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">Protection des Données</h1>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest flex flex-wrap justify-center sm:justify-start gap-4">
                                <span>Conforme Loi 09-08</span>
                                <span className="text-slate-700">•</span>
                                <span>Certifié RGPD</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3">
                            <div className="w-10 h-10 bg-ynov/10 rounded-xl flex items-center justify-center"><Lock className="w-5 h-5 text-ynov" /></div>
                            <h3 className="font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">Sécurité de traitement</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Vos données sont stockées de manière sécurisée et ne sont accessibles qu'aux administrateurs habilités de Maroc Ynov Campus.</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center"><Eye className="w-5 h-5 text-blue-500" /></div>
                            <h3 className="font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">Transparence totale</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Nous collectons uniquement les informations nécessaires au bon déroulement de l'événement et à votre sécurité.</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic border-l-4 border-ynov pl-4">Traitement des données (Loi 09-08)</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Conformément à la loi n° 09-08 promulguée par le Dahir 1-09-15 du 18 février 2009, relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, les informations collectées sur ce site sont destinées à la gestion des participants aux événements organisés par Maroc Ynov Campus. Ce traitement a fait l'objet d'une déclaration auprès de la CNDP.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic border-l-4 border-ynov pl-4">Collecte et Finalités</h2>
                            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                                <p>Les données collectées (Nom, Prénom, Email, Téléphone, Entreprise) sont traitées pour :</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>L'envoi de votre badge numérique par email.</li>
                                    <li>La vérification de votre identité à l'entrée de l'événement.</li>
                                    <li>L'établissement de statistiques anonymes de participation.</li>
                                    <li>La communication d'informations relatives à l'événement.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic border-l-4 border-ynov pl-4">Vos Droits</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Vous bénéficiez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Vous pouvez exercer ces droits en nous contactant par email à l'adresse de l'administration du campus de Casablanca.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic border-l-4 border-ynov pl-4">RGPD</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Pour les résidents de l'Union Européenne, nous appliquons également les principes du Règlement Général sur la Protection des Données (RGPD) en matière de portabilité, de droit à l'oubli et de minimisation des données.
                            </p>
                        </section>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-8 sm:p-12 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-4">
                        <Scale className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-xs">CNDP Maroc • Autorisation en cours</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
