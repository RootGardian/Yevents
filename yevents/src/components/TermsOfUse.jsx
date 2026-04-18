import React from 'react';
import { Shield, ChevronLeft, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/inscription" className="inline-flex items-center gap-2 text-slate-400 hover:text-ynov transition-colors font-bold uppercase text-[10px] tracking-widest group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au formulaire
            </Link>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="bg-ynov p-8 sm:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                <ScrollText className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">Conditions Générales</h1>
                        </div>
                        <p className="text-white/70 text-xs sm:text-sm font-medium uppercase tracking-widest">Dernière mise à jour : 16 Avril 2026</p>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-10 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs not-italic text-ynov font-black">01</span>
                            Objet du service
                        </h2>
                        <p className="text-sm">
                            Le site Yevents est une plateforme de gestion d'événements opérée par Ynov Campus. L'accès et l'utilisation de ce service sont soumis à l'acceptation pleine et entière des présentes conditions générales. Le service permet l'inscription, la génération de badges numériques et la gestion des accès aux locaux de l'établissement.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-10">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs not-italic text-ynov font-black">02</span>
                            Modalités d'inscription
                        </h2>
                        <p className="text-sm">
                            L'utilisateur s'engage à fournir des informations exactes et sincères lors de son inscription. Toute fausse déclaration pourra entraîner l'annulation de l'inscription et le refus d'accès à l'événement. Le badge généré est strictement personnel et non cessible.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-10">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs not-italic text-ynov font-black">03</span>
                            Droit à l'image
                        </h2>
                        <p className="text-sm">
                            En participant aux événements Ynov, vous reconnaissez que des photographies et/ou vidéos peuvent être prises à des fins de communication institutionnelle. Si vous ne souhaitez pas être filmé ou photographié, nous vous invitons à vous manifester auprès de l'accueil de l'événement.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-10">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs not-italic text-ynov font-black">04</span>
                            Propriété intellectuelle
                        </h2>
                        <p className="text-sm">
                            L'ensemble des éléments constituant ce site (logos, textes, codes, éléments graphiques) est la propriété exclusive de Maroc Ynov Campus ou de leurs auteurs respectifs. Toute reproduction, même partielle, est interdite sans autorisation préalable.
                        </p>
                    </section>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-8 sm:p-12 border-t border-slate-100 dark:border-slate-800 text-center space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                        En utilisant ce service, vous acceptez ces conditions sans réserve.<br />
                        Maroc Ynov Campus se réserve le droit de modifier ces termes à tout moment.
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Contact support : <a href="mailto:ahmedrachid.bangoura@ynov.com" className="text-ynov hover:underline">ahmedrachid.bangoura@ynov.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
