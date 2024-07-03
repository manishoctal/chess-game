import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import helpers from "utils/helpers";
import ErrorMessage from "components/ErrorMessage";
import LoaderButton from "components/reusable/LoaderButton";
import Select from "react-select";
import OInputField from "components/reusable/OInputField";

const AddQuestion = ({ setEditShowTradingModal }) => {
    const { t } = useTranslation();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
    const [selectedQuestionType, setSelectedQuestiontype] = useState([])
    const [questionType] = useState([
        {
            "label": "Team performance",
            "value": "teamPerformance"
        },
        {
            "label": "Team Player",
            "value": "teamPlayer"
        },
        {
            "label": "Specific Events",
            "value": "specificEvents"
        },
        {
            "label": "Technical Decisions",
            "value": "technicalDecisions"
        },
        {
            "label": "Match Outcome",
            "value": "matchOutcomes"
        },
        {
            "label": "Injuries and Substitutions",
            "value": "injuriesSubstitutions"
        }, { "label": "Umpiring and Rules", "value": "umpiringRules" }
    ])
    const [loader] = useState(false)

    // default value for edit code
    // submit function start
    const handleSubmitAddQuestionForm = async (e) => {
        console.log('e', e)
    };
    // submit function end



    const customStyles = {
        option: (provided) => ({
            ...provided,
            fontSize: '13px',
            zIndex: 999
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: '14px',
        }),

        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            position: 'absolute',
            
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        control: (provided) => ({
            ...provided,
            width: selectedQuestionType?.length<2?320:'', 
          }),

    };



    return (
        <>
            <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
                <form onSubmit={handleSubmit(handleSubmitAddQuestionForm)} method="post">
                    <div className="relative w-auto my-6 mx-auto max-w-4xl">
                        <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                            <div className=" flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                                <h3 className="text-xl font-semibold dark:text-white">
                                    {t("ADD_QUESTIONS")}
                                </h3>
                                <button
                                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                                    onClick={() => setEditShowTradingModal(false)}
                                >
                                    <button type="button"
                                        title={t("CLOSE")}
                                        className="hover:text-blue-700 transition duration-150 ease-in-out"
                                        data-bs-toggle="tooltip" >
                                        <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                                    </button>
                                </button>
                            </div>


                            <div className="flex items-center mb-3 ml-3 mt-3">
                                <div className="px-2">
                                    <label htmlFor="formatType" className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1" > {t("QUESTION_TYPE")} </label>
                                    <Select
                                        isMulti
                                        className='border-1 rounded-lg border-[#DFDFDF]'
                                        name="formatType"
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("SELECT_QUESTION_TYPE")}
                                            </span>
                                        }
                                        options={questionType}
                                        onChange={(e) => { setSelectedQuestiontype(e) }}
                                        styles={customStyles}
                                        menuPortalTarget={document.body}
                                    />
                                </div>

                            </div>
                            {selectedQuestionType && selectedQuestionType?.map((data, i) => {
                                return <>
                                    {data?.value == 'teamPerformance' &&
                                        <div className="flex items-center mb-3 ml-3 mt-3">
                                            <div className="px-2">
                                                <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Team Performance</p>
                                                <div className="mb-4">
                                                    <div className="mb-2">
                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            id='team'
                                                        />
                                                        <label htmlFor='team'>Did </label>
                                                        <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="">Select Team</option>
                                                            <option value="teamA">Team A</option>
                                                            <option value="teamB">Team B</option>
                                                        </select>
                                                        <select className="mx-1 p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="wins">Wins</option>
                                                            <option value="loses">Loses</option>
                                                        </select>
                                                        <label htmlFor='team'> the match? </label>
                                                    </div>
                                                    <div className="mb-2">

                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            id='team1'
                                                        />
                                                        <label htmlFor='team1'>Did </label>
                                                        <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="">Select Team</option>
                                                            <option value="teamA">Team A</option>
                                                            <option value="teamB">Team B</option>
                                                        </select>
                                                        <label htmlFor='team1'> score more than </label>
                                                        <input
                                                            type="number"
                                                            className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer w-[90px]"
                                                            placeholder="Set run"
                                                        />
                                                        <label htmlFor='team1'> runs? </label>
                                                        <input type="number" className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer" placeholder="Threshold value of run" />
                                                    </div>
                                                    <div className="mb-2">
                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            id='team2'
                                                        />
                                                        <label htmlFor='team2'>Did </label>
                                                        <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="">Select Team</option>
                                                            <option value="teamA">Team A</option>
                                                            <option value="teamB">Team B</option>
                                                        </select>
                                                        <label htmlFor='team2'> lose more than </label>
                                                        <input
                                                            type="number"
                                                            className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg w-[90px] border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                                            placeholder="Set wickets"
                                                        />
                                                        <label htmlFor='team2'> wickets in their innings? </label>
                                                        <input type="number" placeholder="Threshold value of wicket" className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg  border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}

                                    {data?.value == 'teamPlayer' && <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Player performance</p>
                                            <div className="mb-4">
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='player'
                                                    />
                                                    <label htmlFor='player'>Did </label>
                                                    <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0 peer">
                                                        <option value="">Select Player X</option>
                                                        <option value="teamA">Player A</option>
                                                        <option value="teamB">Player B</option>
                                                    </select>
                                                    <label htmlFor='player'> score a century? </label>
                                                    <input type="number" className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0 mx-1 peer" placeholder="Threshold value" />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='player1'
                                                    />
                                                    <label htmlFor='player1'>Did </label>
                                                    <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                        <option value="">Select Player Y</option>
                                                        <option value="teamA">Player A</option>
                                                        <option value="teamB">Player B</option>
                                                    </select>
                                                    <label htmlFor='player1'> take </label>
                                                    <input
                                                        type="number"
                                                        className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer w-[90px]"

                                                        placeholder="Set wicket"
                                                    />
                                                    <label htmlFor='player1'> or more wickets in the match? </label>
                                                    <input type="number" className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer" placeholder="Threshold value of wicket" />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='player2'
                                                    />
                                                    <label htmlFor='player2'>Did </label>
                                                    <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                        <option value="">Select Player Z</option>
                                                        <option value="teamA">Player A</option>
                                                        <option value="teamB">Player B</option>
                                                    </select>
                                                    <label htmlFor='player2'> hit more than </label>
                                                    <input
                                                        type="number"
                                                        className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg w-[90px] border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                                        placeholder="Set sixes"
                                                    />
                                                    <label htmlFor='player2'> sixes? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.value == 'specificEvents' && <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Specific Events</p>
                                            <div className="mb-4">
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='Specific'
                                                    />
                                                    <label htmlFor='Specific'>Was there a hat-trick taken in the match? </label>
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='Specific1'
                                                    />
                                                    <label htmlFor='Specific1'>Did </label>
                                                    <select className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                        <option value="">Select Team</option>
                                                        <option value="teamA">Team A</option>
                                                        <option value="teamB">Team B</option>
                                                    </select>
                                                    <label htmlFor='Specific1'> win the toss and choose to bat first? </label>
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='Specific2'
                                                    />
                                                    <label htmlFor='Specific2'>Was there a rain interruption during the match? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.value == 'technicalDecisions' && <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Technical Decisions</p>
                                            <div className="mb-4">
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='decisions'
                                                    />
                                                    <label htmlFor='decisions'>Was there a DRS (Decision Review System) review during the match? </label>
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='decisions1'
                                                    />
                                                    <label htmlFor='decisions1'>Did the third umpire overturn an on-field decision? </label>
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        id='decisions2'
                                                    />
                                                    <label htmlFor='decisions2'>Was any player given out for obstructing the field? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.value == 'matchOutcomes' && <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Match Outcome</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 gap-2 flex">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes"
                                                        id='outcomes'
                                                    />
                                                    <label htmlFor='outcomes'>Was the match decided by the Duckworth-Lewis method? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes1"
                                                        id='outcomes1'
                                                    />
                                                    <label htmlFor='outcomes1'>Did the match end in a tie? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes2"
                                                        id='outcomes2'
                                                    />
                                                    <label htmlFor='outcomes2'>Did the match go to a Super Over? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.value == 'injuriesSubstitutions' && <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Injuries and Substitutions</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="injuries1"
                                                        id='injuries1'
                                                    />
                                                    <label htmlFor='injuries1'>Was any player substituted due to injury? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="injuries2"
                                                        id="injuries2"
                                                    />
                                                    <label htmlFor='injuries2'>Did a concussion substitute come into play during the match? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.value == 'umpiringRules' && <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Umpiring and Rules</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="rules1"
                                                        id="rules1"
                                                    />
                                                    <label htmlFor='rules1'>Was there a no-ball called for overstepping? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="rules2"
                                                        id="rules2"
                                                    />
                                                    <label htmlFor='rules2'>Did any player receive a penalty for dissent or misconduct? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </>
                            })}
                            {selectedQuestionType?.length === 0 && <div className='flex justify-center h-[50px]'>
                                <span style={{ fontSize: '14px' }}>No Question Type Selected.</span>
                            </div>}
                            <div className="px-6 border-t py-3">
                                <div className="relative z-0 mb-6 w-[70%] ">
                                    <OInputField
                                        type="text"
                                        name="title"
                                        id="title"
                                        inputLabel={
                                            <>
                                                {t('SET_QUESTION_MANUALLY')}
                                            </>
                                        }
                                        wrapperClassName="relative z-0  w-full group"
                                        placeholder={t('ENTER_QUESTION')}
                                        maxLength={500}
                                        register={register("manualQuestion", {
                                            minLength: {
                                                value: 2,
                                                message: t('MINIMUM_LENGTH_MUST_BE_2'),
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: "Minimum length must be 500.",
                                            },

                                        })}
                                    />
                                    <ErrorMessage message={errors?.manualQuestion?.message} />
                                </div>
                            </div>


                            <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    title={t("CLOSE")}
                                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setEditShowTradingModal(false)}
                                >
                                    {t("CLOSE")}
                                </button>
                                {helpers.ternaryCondition(loader,
                                    <LoaderButton />,
                                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" type="submit"
                                        title={t("O_ADD")}>{t("O_ADD")} </button>)}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
    );
};

export default AddQuestion;

