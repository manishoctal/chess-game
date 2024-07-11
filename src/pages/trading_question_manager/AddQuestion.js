import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import helpers from "utils/helpers";
import ErrorMessage from "components/ErrorMessage";
import LoaderButton from "components/reusable/LoaderButton";
import Select from "react-select";
import OInputField from "components/reusable/OInputField";
import { startCase } from "lodash";
import { preventMaxInput } from "utils/validations";
const AddQuestion = ({ setEditShowTradingModal, stateData }) => {
    const { t } = useTranslation();
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
    const [selectedQuestionType, setSelectedQuestiontype] = useState([])
    const [teamPerformance, setTeamPerformance] = useState({ index1: false, index2: false, index3: false })
    const [playerPerformance, setPlayerPerformance] = useState({ index1: false, index2: false, index3: false })
    const [specificEvent, setSPecificEvent] = useState({ index1: false, index2: false, index3: false })
    const [technicalDecision, setTechnicalDecision] = useState({ index1: false, index2: false, index3: false })
    const [matchOutcome, setMatchOutcome] = useState({ index1: false, index2: false, index3: false })
    const [injuryAndSubs, setInjuryAndSubs] = useState({ index1: false, index2: false })
    const [umpiringRules, setUmpiringRules] = useState({ index1: false, index2: false })


    const [questionType] = useState([
        {
            "label": "Team performance",
            "value": "teamPerformance"
        },
        {
            "label": "Player Performance",
            "value": "playerPerformance"
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

    const checkAllAccess = () => {

        // check if no question is selected
        if (selectedQuestionType?.length == 0) {
            setTeamPerformance({ index1: false, index2: false, index3: false })
            setPlayerPerformance({ index1: false, index2: false, index3: false })
            setSPecificEvent({ index1: false, index2: false, index3: false })
            setTechnicalDecision({ index1: false, index2: false, index3: false })
            setMatchOutcome({ index1: false, index2: false, index3: false })
            setInjuryAndSubs({ index1: false, index2: false })
            setUmpiringRules({ index1: false, index2: false, })
            setValue('teamPerformance.questions.0.slug', '')
            setValue('teamPerformance.questions.1.slug', '')
            setValue('teamPerformance.questions.2.slug', '')

            setValue('teamPerformance.questions.0.teamId', '')
            setValue('teamPerformance.questions.0.winLoss', '')

            setValue('teamPerformance.questions.1.teamId', '')
            setValue('teamPerformance.questions.1.score', '')
            setValue('teamPerformance.questions.1.threshold', '')

            setValue('teamPerformance.questions.2.teamId', '')
            setValue('teamPerformance.questions.2.wickets', '')
            setValue('teamPerformance.questions.2.threshold', '')

            setValue('playerPerformance.questions.0.slug', '')

            setValue('playerPerformance.questions.0.playerId', '')
            setValue('playerPerformance.questions.0.threshold', '')

            setValue('playerPerformance.questions.1.slug', '')

            setValue('playerPerformance.questions.1.playerId', '')
            setValue('playerPerformance.questions.1.wicket', '')
            setValue('playerPerformance.questions.1.threshold', '')

            setValue('playerPerformance.questions.2.slug', '')
            setValue('playerPerformance.questions.2.playerId', '')
            setValue('playerPerformance.questions.2.sixes', '')

            setValue('specificEvent.questions.0.slug', '')
            setValue('specificEvent.questions.1.slug', '')
            setValue('specificEvent.questions.1.teamId', '')

            setValue('specificEvent.questions.2.slug', '')
            setValue('technicalDecision.questions.0.slug', '')
            setValue('technicalDecision.questions.1.slug', '')
            setValue('technicalDecision.questions.2.slug', '')
            setValue('matchOutcome.questions.0.slug', '')
            setValue('matchOutcome.questions.1.slug', '')
            setValue('matchOutcome.questions.2.slug', '')
            setValue('injuryAndSubs.questions.0.slug', '')
            setValue('injuryAndSubs.questions.1.slug', '')
            setValue('umpiringRules.questions.0.slug', '')
            setValue('umpiringRules.questions.1.slug', '')
            return
        }

        // check if any particular question is not selected
        if (!checkValueExists("teamPerformance")) {
            setTeamPerformance({ index1: false, index2: false, index3: false })
            setValue('teamPerformance.questions.0.slug', '')
            setValue('teamPerformance.questions.1.slug', '')
            setValue('teamPerformance.questions.2.slug', '')

            setValue('teamPerformance.questions.0.teamId', '')
            setValue('teamPerformance.questions.0.winLoss', '')

            setValue('teamPerformance.questions.1.teamId', '')
            setValue('teamPerformance.questions.1.score', '')
            setValue('teamPerformance.questions.1.threshold', '')

            setValue('teamPerformance.questions.2.teamId', '')
            setValue('teamPerformance.questions.2.wickets', '')
            setValue('teamPerformance.questions.2.threshold', '')
        }
        if (!checkValueExists("playerPerformance")) {
            setPlayerPerformance({ index1: false, index2: false, index3: false })
            setValue('playerPerformance.questions.0.slug', '')
            setValue('playerPerformance.questions.1.slug', '')
            setValue('playerPerformance.questions.2.slug', '')

            setValue('playerPerformance.questions.0.playerId', '')
            setValue('playerPerformance.questions.0.threshold', '')


            setValue('playerPerformance.questions.1.playerId', '')
            setValue('playerPerformance.questions.1.wicket', '')
            setValue('playerPerformance.questions.1.threshold', '')

            setValue('playerPerformance.questions.2.playerId', '')
            setValue('playerPerformance.questions.2.sixes', '')
        }
        if (!checkValueExists("specificEvents")) {
            setSPecificEvent({ index1: false, index2: false, index3: false })
            setValue('specificEvent.questions.0.slug', '')
            setValue('specificEvent.questions.1.slug', '')
            setValue('specificEvent.questions.2.slug', '')
            setValue('specificEvent.questions.1.teamId', '')
        }
        if (!checkValueExists("technicalDecisions")) {
            setTechnicalDecision({ index1: false, index2: false, index3: false })
            setValue('technicalDecision.questions.0.slug', '')
            setValue('technicalDecision.questions.1.slug', '')
            setValue('technicalDecision.questions.2.slug', '')
        }
        if (!checkValueExists("matchOutcomes")) {
            setMatchOutcome({ index1: false, index2: false, index3: false })
            setValue('matchOutcome.questions.0.slug', '')
            setValue('matchOutcome.questions.1.slug', '')
            setValue('matchOutcome.questions.2.slug', '')
        }
        if (!checkValueExists("injuriesSubstitutions")) {
            setInjuryAndSubs({ index1: false, index2: false })
            setValue('injuryAndSubs.questions.0.slug', '')
            setValue('injuryAndSubs.questions.1.slug', '')
        }
        if (!checkValueExists("umpiringRules")) {
            setUmpiringRules({ index1: false, index2: false })
            setValue('umpiringRules.questions.0.slug', '')
            setValue('umpiringRules.questions.1.slug', '')
        }
    }

    useEffect(() => {
        checkAllAccess()
    }, [selectedQuestionType])

    function checkValueExists(valueToCheck) {
        return selectedQuestionType?.some(item => item?.value === valueToCheck);
    }


    // submit function start
    const handleSubmitAddQuestionForm = async (e) => {

        function transformData(data) {
            const result = [];

            Object.keys(data).forEach(key => {
                if (helpers.andOperator(Array.isArray(data[key]?.questions), data[key]?.questions?.length > 0)) {
                    const category = key?.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
                    const questions = data[key]?.questions?.filter(question => question?.slug).map(question => {
                        if (question?.teamId) {
                            return {
                                ...question,
                                slug: question?.slug?.toUpperCase(),
                                teamId: question?.teamId,
                            };
                        } else {
                            return {
                                ...question,
                                slug: question?.slug?.toUpperCase(),
                            };
                        }
                    });
                    result.push({
                        category,
                        questions
                    });
                }
            });
            return result;
        }

        const transformedData = transformData(e);
        const formattedData = transformedData?.filter(item => item.questions.length > 0)
        if (e?.manualQuestion) {
            formattedData?.push({ category: 'MANUAL_QUESTION', questions: [{ slug: 'MANUAL_QUESTION', question: e?.manualQuestion }] })
        }

        console.log('formattedData', formattedData)

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
            width: selectedQuestionType?.length < 2 ? 320 : '',
        }),

    };


    // for view match details
    const getTableDataViewQuestion = (details, inputClass) => {
        return <td className={`py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-semibold ${inputClass || ''}`}>
            {details || 'N/A'}
        </td>
    }

    const getTableHeaderAddQuestion = (name) => {
        return <th className='text-center py-3 px-6'>{t(name)}</th>

    }


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


                            <div className='m-5'>
                                <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                        <tr>
                                            {getTableHeaderAddQuestion('MATCH_NAME')}
                                            {getTableHeaderAddQuestion('FORMAT_TYPE')}
                                            {getTableHeaderAddQuestion('STATUS_OF_MATCH')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            {getTableDataViewQuestion(startCase(stateData?.matchName) || 'N/A')}
                                            {getTableDataViewQuestion(startCase(stateData?.formatType) || 'N/A')}
                                            {getTableDataViewQuestion(startCase(stateData?.matchStatus),helpers.getMatchStatus(stateData?.matchStatus))}
                                        </tr>
                                    </tbody>
                                </table>
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
                                    {helpers.andOperator(data?.value == 'teamPerformance',
                                        <div className="flex items-center mb-3 ml-3 mt-3">
                                            <div className="px-2">
                                                <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Team Performance</p>
                                                <div className="mb-4 mt-2">
                                                    <div className="mb-2 flex gap-2">
                                                        <OInputField
                                                            type="checkbox"
                                                            name='questions.0.slug'
                                                            id='team'
                                                            value={helpers.ternaryCondition(teamPerformance?.index1, 'did_team_win_loss_match', '')}
                                                            register={register(`teamPerformance.questions.0.slug`, { onChange: () => { setTeamPerformance({ ...teamPerformance, index1: !teamPerformance?.index1 }) } })}
                                                        />
                                                        <label htmlFor='team'>Did </label>
                                                        <div>
                                                            <select disabled={!teamPerformance?.index1} {...register('teamPerformance.questions.0.teamId', { required: helpers.orOperator(teamPerformance?.index1, false), })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                                <option value="">Select Team</option>
                                                                <option value="teamA">Team A</option>
                                                                <option value="teamB">Team B</option>
                                                            </select>
                                                            {errors?.teamPerformance?.questions[0]?.teamId && <div className="text-[12px] text-red-500">Please select team.</div>}
                                                        </div>
                                                        <div>
                                                            <select disabled={!teamPerformance?.index1} {...register('teamPerformance.questions.0.winLoss', { required: helpers.orOperator(teamPerformance?.index1, false) })} className="mx-1 p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                                <option value="">Select Win/Lose</option>
                                                                <option value="wins">Wins</option>
                                                                <option value="loses">Loss</option>
                                                            </select>
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[0]?.winLoss, <div className="text-[12px] text-red-500">Please select win/lose.</div>)}
                                                        </div>
                                                        <label htmlFor='team'> the match? </label>
                                                    </div>
                                                    <div className="mb-2 gap-2 flex">
                                                        <OInputField
                                                            type="checkbox"
                                                            name="team1"
                                                            id='team1'
                                                            value={helpers.ternaryCondition(teamPerformance?.index2, 'did_team_score_more_than', '')}
                                                            register={register(`teamPerformance.questions.1.slug`, { onChange: () => { setTeamPerformance({ ...teamPerformance, index2: !teamPerformance?.index2 }) } })}
                                                        />
                                                        <label htmlFor='team1'>Did </label>
                                                        <div>
                                                            <select disabled={!teamPerformance?.index2} {...register('teamPerformance.questions.1.teamId', { required: helpers.orOperator(teamPerformance?.index2, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                                <option value="">Select Team</option>
                                                                <option value="teamA">Team A</option>
                                                                <option value="teamB">Team B</option>
                                                            </select>
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[1]?.teamId, <div className="text-[12px] text-red-500">Please select team.</div>)}
                                                        </div>
                                                        <label htmlFor='team1'> score more than </label>
                                                        <div>
                                                            <input
                                                                type="number"
                                                                {...register('teamPerformance.questions.1.score', { required: helpers.orOperator(teamPerformance?.index2, false) })}
                                                                className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer w-[90px]"
                                                                placeholder="Set Run"
                                                                disabled={!teamPerformance?.index2}

                                                            />
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[1]?.score, <div className="text-[12px] text-red-500">Please enter run.</div>)}
                                                        </div>
                                                        <label htmlFor='team1'> runs? </label>
                                                        <div>
                                                            <input type="number" disabled={!teamPerformance?.index2}  {...register('teamPerformance.questions.1.threshold', { required: helpers.orOperator(teamPerformance?.index2, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer" placeholder="Threshold Value Of Run" />
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[1]?.threshold, <div className="text-[12px] text-red-500">Please enter threshold value.</div>)}
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 gap-2 flex">

                                                        <OInputField
                                                            type="checkbox"
                                                            name="team2"
                                                            id='team2'
                                                            value={helpers.ternaryCondition(teamPerformance?.index3, 'did_team_lose_more_than_wickets', '')}
                                                            register={register(`teamPerformance.questions.2.slug`, { onChange: () => { setTeamPerformance({ ...teamPerformance, index3: !teamPerformance?.index3 }) } })}
                                                        />
                                                        <label htmlFor='team2'>Did </label>
                                                        <div>
                                                            <select disabled={!teamPerformance?.index3} {...register('teamPerformance.questions.2.teamId', { required: helpers.orOperator(teamPerformance?.index3, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                                <option value="">Select Team</option>
                                                                <option value="teamA">Team A</option>
                                                                <option value="teamB">Team B</option>
                                                            </select>
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[2]?.teamId, <div className="text-[12px] text-red-500">Please select team.</div>)}
                                                        </div>
                                                        <label htmlFor='team2'> lose more than </label>
                                                        <div>
                                                            <input
                                                                type="number"
                                                                disabled={!teamPerformance?.index3}
                                                                {...register('teamPerformance.questions.2.wickets', { required: helpers.orOperator(teamPerformance?.index3, false) })}
                                                                className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg w-[90px] border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                                                placeholder="Set Wickets"
                                                            />
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[2]?.wickets, <div className="text-[12px] text-red-500">Please enter wicket.</div>)}
                                                        </div>
                                                        <label htmlFor='team2'> wickets in their innings? </label>
                                                        <div>
                                                            <input type="number" disabled={!teamPerformance?.index3} {...register('teamPerformance.questions.2.threshold', { required: helpers.orOperator(teamPerformance?.index3, false) })} placeholder="Threshold Value Of Wicket" className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg  border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer" />
                                                            {helpers.andOperator(errors?.teamPerformance?.questions[2]?.threshold, <div className="text-[12px] text-red-500">Please enter threshold value.</div>)}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)}

                                    {helpers.andOperator(data?.value == 'playerPerformance', <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Player performance</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="player"
                                                        id='player'
                                                        value={helpers.ternaryCondition(playerPerformance?.index1, 'did_player_score_century', '')}
                                                        register={register(`playerPerformance.questions.0.slug`, { onChange: () => { setPlayerPerformance({ ...playerPerformance, index1: !playerPerformance?.index1 }) } })}
                                                    />
                                                    <label htmlFor='player'>Did </label>
                                                    <div>
                                                        <select disabled={!playerPerformance?.index1} {...register('playerPerformance.questions.0.playerId', { required: helpers.orOperator(playerPerformance?.index1, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0 peer">
                                                            <option value="">Select Player X</option>
                                                            <option value="teamA">Player A</option>
                                                            <option value="teamB">Player B</option>
                                                        </select>
                                                        {helpers.andOperator(errors?.playerPerformance?.questions[0]?.playerId, <div className="text-[12px] text-red-500">Please select player.</div>)}
                                                    </div>
                                                    <label htmlFor='player'> score a century? </label>
                                                    <div>
                                                        <input type="number" disabled={!playerPerformance?.index1} {...register('playerPerformance.questions.0.threshold', { required: helpers.orOperator(playerPerformance?.index1, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0 mx-1 peer" placeholder="Threshold Value" />
                                                        {helpers.andOperator(errors?.playerPerformance?.questions[0]?.threshold, <div className="text-[12px] text-red-500">Please enter threshold value.</div>)}
                                                    </div>
                                                </div>
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="player1"
                                                        id='player1'
                                                        value={helpers.ternaryCondition(playerPerformance?.index2, 'did_player_take_more_wicket', '')}
                                                        register={register(`playerPerformance.questions.1.slug`, { onChange: () => { setPlayerPerformance({ ...playerPerformance, index2: !playerPerformance?.index2 }) } })}
                                                    />
                                                    <label htmlFor='player1'>Did </label>
                                                    <div>
                                                        <select disabled={!playerPerformance?.index2} {...register('playerPerformance.questions.1.playerId', { required: playerPerformance?.index2 || false, })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="">Select Player Y</option>
                                                            <option value="teamA">Player A</option>
                                                            <option value="teamB">Player B</option>
                                                        </select>
                                                        {helpers.andOperator(errors?.playerPerformance?.questions[1]?.playerId, <div className="text-[12px] text-red-500">Please select player.</div>)}
                                                    </div>
                                                    <label htmlFor='player1'> take </label>
                                                    <div>
                                                        <input
                                                            type="number"
                                                            disabled={!playerPerformance?.index2}
                                                            {...register('playerPerformance.questions.1.wicket', { required: helpers.orOperator(playerPerformance?.index2, false) })}
                                                            className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer w-[90px]"
                                                            placeholder="Set Wicket"
                                                        />
                                                        {helpers.andOperator(errors?.playerPerformance?.questions[1]?.wicket, <div className="text-[12px] text-red-500">Wicket is required.</div>)}

                                                    </div>
                                                    <label htmlFor='player1'> or more wickets in the match? </label>
                                                    <div>
                                                        <input type="number" disabled={!playerPerformance?.index2} {...register('playerPerformance.questions.1.threshold', { required: helpers.orOperator(playerPerformance?.index2, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer" placeholder="Threshold value of wicket" />

                                                        {helpers.andOperator(errors?.playerPerformance?.questions[1]?.threshold, <div className="text-[12px] text-red-500">Please enter threshold value.</div>)}

                                                    </div>
                                                </div>
                                                <div className="mb-2 flex gap-2">


                                                    <OInputField
                                                        type="checkbox"
                                                        name="player2"
                                                        id='player2'
                                                        value={helpers.ternaryCondition(playerPerformance?.index3, 'did_player_hit_more_sixes', '')}
                                                        register={register(`playerPerformance.questions.2.slug`, { onChange: () => { setPlayerPerformance({ ...playerPerformance, index3: !playerPerformance?.index3 }) } })}
                                                    />
                                                    <label htmlFor='player2'>Did </label>
                                                    <div>
                                                        <select disabled={!playerPerformance?.index3} {...register('playerPerformance.questions.2.playerId', { required: helpers.orOperator(playerPerformance?.index3, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="">Select Player Z</option>
                                                            <option value="teamA">Player A</option>
                                                            <option value="teamB">Player B</option>
                                                        </select>
                                                        {helpers.andOperator(errors?.playerPerformance?.questions[2]?.playerId, <div className="text-[12px] text-red-500">Please select player.</div>)}
                                                    </div>
                                                    <label htmlFor='player2'> hit more than </label>
                                                    <div className="mt-">
                                                        <input
                                                            type="number"
                                                            disabled={!playerPerformance?.index3}
                                                            {...register('playerPerformance.questions.2.sixes', { required: playerPerformance?.index3 || false, })}
                                                            className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg w-[90px] border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                                            placeholder="Set Sixes"
                                                        />
                                                        {helpers.andOperator(errors?.playerPerformance?.questions[2]?.sixes, <div className="text-[12px] text-red-500">Sixes are required.</div>)}

                                                    </div>
                                                    <label htmlFor='player2'> sixes? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                    {helpers.andOperator(data?.value == 'specificEvents', <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Specific Events</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes"
                                                        id='Specific'
                                                        value={helpers.ternaryCondition(specificEvent?.index1, 'was_hat_trick_taken', '')}
                                                        register={register(`specificEvent.questions.0.slug`, { onChange: () => { setSPecificEvent({ ...specificEvent, index1: !specificEvent?.index1 }) } })}
                                                    />
                                                    <label htmlFor='Specific'>Was there a hat-trick taken in the match? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes"
                                                        id='Specific1'
                                                        value={helpers.ternaryCondition(specificEvent?.index2, 'did_team_win_toss_and_choose_bat_first', '')}
                                                        register={register(`specificEvent.questions.1.slug`, { onChange: () => { setSPecificEvent({ ...specificEvent, index2: !specificEvent?.index2 }) } })}
                                                    />
                                                    <label htmlFor='Specific1'>Did </label>
                                                    <div>

                                                        <select disabled={!specificEvent?.index2}  {...register('specificEvent.questions.1.teamId', { required: helpers.orOperator(specificEvent?.index2, false) })} className="p-1 text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer">
                                                            <option value="">Select Team</option>
                                                            <option value="teamA">Team A</option>
                                                            <option value="teamB">Team B</option>
                                                        </select>
                                                        {helpers.andOperator(errors?.specificEvent?.questions[1]?.teamId, <div className="text-[12px] text-red-500">Please select team.</div>)}
                                                    </div>
                                                    <label htmlFor='Specific1'> win the toss and choose to bat first? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes"
                                                        id='Specific2'
                                                        value={helpers.ternaryCondition(specificEvent?.index3, 'was_there_rain_intruption', '')}
                                                        register={register(`specificEvent.questions.2.slug`, { onChange: () => { setSPecificEvent({ ...specificEvent, index3: !specificEvent?.index3 }) } })}
                                                    />
                                                    <label htmlFor='Specific2'>Was there a rain interruption during the match? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                    {helpers.andOperator(data?.value == 'technicalDecisions', <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Technical Decisions</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="decisions"
                                                        id='decisions'
                                                        value={helpers.ternaryCondition(technicalDecision?.index1, 'was_there_drs_during_match', '')}
                                                        register={register(`technicalDecision.questions.0.slug`, { onChange: () => { setTechnicalDecision({ ...technicalDecision, index1: !technicalDecision?.index1 }) } })}
                                                    />

                                                    <label htmlFor='decisions'>Was there a DRS (Decision Review System) review during the match? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="decisions1"
                                                        id='decisions1'
                                                        value={helpers.ternaryCondition(technicalDecision?.index2, 'did_third_umpire_overturn_on_field_decisions', '')}
                                                        register={register(`technicalDecision.questions.1.slug`, { onChange: () => { setTechnicalDecision({ ...technicalDecision, index2: !technicalDecision?.index2 }) } })}
                                                    />
                                                    <label htmlFor='decisions1'>Did the third umpire overturn an on-field decision? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="decisions2"
                                                        id='decisions2'
                                                        value={helpers.ternaryCondition(technicalDecision?.index3, 'was_any_player_out_for_obstructing', '')}
                                                        register={register(`technicalDecision.questions.2.slug`, { onChange: () => { setTechnicalDecision({ ...technicalDecision, index3: !technicalDecision?.index3 }) } })}
                                                    />
                                                    <label htmlFor='decisions2'>Was any player given out for obstructing the field? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                    {helpers.andOperator(data?.value == 'matchOutcomes', <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Match Outcome</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 gap-2 flex">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes"
                                                        id='outcomes'
                                                        value={helpers.ternaryCondition(matchOutcome?.index1, 'was_the_match_decided_by_duckworth_lewis', '')}
                                                        register={register(`matchOutcome.questions.0.slug`, { onChange: () => { setMatchOutcome({ ...matchOutcome, index1: !matchOutcome?.index1 }) } })}
                                                    />
                                                    <label htmlFor='outcomes'>Was the match decided by the Duckworth-Lewis method? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes1"
                                                        id='outcomes1'
                                                        value={helpers.ternaryCondition(matchOutcome?.index2, 'did_match_tie', '')}
                                                        register={register(`matchOutcome.questions.1.slug`, { onChange: () => { setMatchOutcome({ ...matchOutcome, index2: !matchOutcome?.index2 }) } })}
                                                    />
                                                    <label htmlFor='outcomes1'>Did the match end in a tie? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="outcomes2"
                                                        id='outcomes2'
                                                        value={helpers.ternaryCondition(matchOutcome?.index3, 'did_there_super_over', '')}
                                                        register={register(`matchOutcome.questions.2.slug`, { onChange: () => { setMatchOutcome({ ...matchOutcome, index3: !matchOutcome?.index3 }) } })}
                                                    />
                                                    <label htmlFor='outcomes2'>Did the match go to a Super Over? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                    {helpers.andOperator(data?.value == 'injuriesSubstitutions', <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Injuries and Substitutions</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">

                                                    <OInputField
                                                        type="checkbox"
                                                        name="injuries1"
                                                        id='injuries1'
                                                        value={helpers.ternaryCondition(injuryAndSubs?.index1, 'was_any_player_substituted', '')}
                                                        register={register(`injuryAndSubs.questions.0.slug`, { onChange: () => { setInjuryAndSubs({ ...injuryAndSubs, index1: !injuryAndSubs?.index1 }) } })}
                                                    />
                                                    <label htmlFor='injuries1'>Was any player substituted due to injury? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="injuries2"
                                                        id="injuries2"
                                                        value={helpers.ternaryCondition(injuryAndSubs?.index2, 'did_concussion_substituted_come_into_play', '')}
                                                        register={register(`injuryAndSubs.questions.1.slug`, { onChange: () => { setInjuryAndSubs({ ...injuryAndSubs, index2: !injuryAndSubs?.index2 }) } })}
                                                    />
                                                    <label htmlFor='injuries2'>Did a concussion substitute come into play during the match? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                    {helpers.andOperator(data?.value == 'umpiringRules', <div className="flex items-center mb-3 ml-3 mt-3">
                                        <div className="px-2">
                                            <p className="font-medium text-sm text-[#000] dark:text-gray-400 block mb-1"><span className='font-bold'>{i + 1}.</span> Umpiring and Rules</p>
                                            <div className="mb-4 mt-2">
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="rules1"
                                                        id="rules1"
                                                        value={helpers.ternaryCondition(umpiringRules?.index1, 'was_there_a_no_ball', '')}
                                                        register={register(`umpiringRules.questions.0.slug`, { onChange: () => { setUmpiringRules({ ...umpiringRules, index1: !umpiringRules?.index1 }) } })}
                                                    />
                                                    <label htmlFor='rules1'>Was there a no-ball called for overstepping? </label>
                                                </div>
                                                <div className="mb-2 flex gap-2">
                                                    <OInputField
                                                        type="checkbox"
                                                        name="rules2"
                                                        id="rules2"
                                                        value={helpers.ternaryCondition(umpiringRules?.index2, 'did_any_player_receive_penalty', '')}
                                                        register={register(`umpiringRules.questions.1.slug`, { onChange: () => { setUmpiringRules({ ...umpiringRules, index2: !umpiringRules?.index2 }) } })}
                                                    />
                                                    <label htmlFor='rules2'>Did any player receive a penalty for dissent or misconduct? </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                                </>
                            })}
                            {helpers.andOperator(selectedQuestionType?.length === 0, <div className='flex justify-center h-[50px]'>
                                <span style={{ fontSize: '14px' }}>No Question Type Selected.</span>
                            </div>)}
                            <div className="px-6 border-t py-3">
                                <div className="relative z-0 mb-6 w-[70%] ">
                                    <OInputField
                                        type="text"
                                        name="manualQuestion"
                                        id="manualQuestion"
                                        inputLabel={
                                            <>
                                                {t('SET_QUESTION_MANUALLY')}
                                            </>
                                        }
                                        wrapperClassName="relative z-0  w-full group"
                                        placeholder={t('ENTER_QUESTION')}
                                        maxLength={100}
                                        onInput={e => preventMaxInput(e, 100)}
                                        register={register("manualQuestion", {
                                            minLength: {
                                                value: 2,
                                                message: t('MINIMUM_LENGTH_MUST_BE_2'),
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "Minimum length must be 100.",
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

