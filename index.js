
const app = document.querySelector('.app')
const appButtons = document.querySelectorAll('.app__button')

/**
 * Add click event listener to .app__button
 */
const addListenerToAppButtons = () => {
	appButtons.forEach(appButton => {
		appButton.addEventListener('click', handleAppButtonClick)
	})
}

/**
 * Handle .app__button click event
 * @param {object} event 
 */
const handleAppButtonClick = (event) => {
	const button = event.currentTarget

	/**
	 * Set new stage
	 */
	const currentStage = parseInt(app.getAttribute('data-current'))
	const newStage = currentStage + 1

	switchStage(newStage)
	setupStage(newStage, button)
}

/**
 * Show new stage
 * @param  {number} newStage
 */
const switchStage = (newStage) => {
	hideStages()

	const stage = document.querySelector(`.app__stage[data-stage="${newStage}"]`)
	stage.classList.remove('hide')
}

/**
 * Setup stage
 * Run related stage handler
 * @param {number} stage 
 * @param {object} playerButton 
 */
const setupStage = (stage, playerButton) => {
	switch (stage) {
		case 2:
			playerButton && handleStage2(playerButton)
			break
		default:
			break
	}
}

const stageTwo = document.querySelector('.app__stage[data-stage="2"]')
const appCols = stageTwo.querySelectorAll('.app__col')

/**
 * Handle stage 2
 * @param {object} playerButton 
 */
const handleStage2 = (playerButton) => {
	const clonedPlayerBtn = playerButton.cloneNode(true)
	clonedPlayerBtn.classList.add('picked')

	replaceElement(clonedPlayerBtn, appCols[0].children[0])

	const computerPick = selectComputerPick()
	const playerPick = playerButton.getAttribute('aria-label')

	const result = getResult(playerPick, computerPick)

	animateScore(result)
	animateWinner(result)
	setResultText(result)
	updateScore(result)
}

const score = document.querySelector('.score')

/**
 * Animate score board point change
 * @param {number} result 
 */
const animateScore = (result) => {
	if (result > 0) {
		score.classList.add('add')
	}
	else if (result < 0) {
		score.classList.add('minus')
	}

	score.addEventListener('animationend', () => {
		score.classList.remove('add', 'minus')
	})
}

/**
 * Animate winner button's box shadow
 * @param {number} result 
 */
const animateWinner = (result) => {
	const playerBtn = appCols[0].querySelector('.app__button')
	const compBtn = appCols[1].querySelector('.app__button')

	let winnerBtn
	if (result > 0) {
		winnerBtn = playerBtn
	}
	else if (result < 0) {
		winnerBtn = compBtn
	}

	if (winnerBtn) {
		winnerBtn.classList.add('winner')
	}
	else {
		playerBtn.classList.add('winner')
		compBtn.classList.add('winner')
	}
}

/**
 * Update score value
 * > Calculate new score
 * @param {number} result
 */
const updateScore = (result) => {
	const newScore = getScore() + result
	setScore(newScore)
}

const appResult = document.querySelector('.app-result')
const resultText = appResult.querySelector('.app-result__text')
const resultBtn = appResult.querySelector('.app-result__button')

/**
 * Add click event listener to .app-result__button
 */
const addListenerToResultBtn = () => {
	resultBtn.addEventListener('click', handleResultBtnClick)
}

/**
 * Handle .app-result__button click event
 */
const handleResultBtnClick = () => {
	switchStage(1)
	resetStageTwo()
}

/**
 * Reset stage 2 to default view
 * > Show empty circles in buttons' place
 */
const resetStageTwo = () => {
	const emptyButton = document.createElement('div')
	emptyButton.classList.add('app__button', 'picked')

	appCols.forEach(appCol => {
		const clonedEmptyBtn = emptyButton.cloneNode(true)
		const appButton = appCol.querySelector('.app__button')

		replaceElement(clonedEmptyBtn, appButton)
	})
}

/**
 * Get result
 * > Lose: -1
 * > Win: 1
 * > Draw: 0
 * @param {string} playerPick 
 * @param {string} computerPick 
 * @returns {number}
 */
const getResult = (playerPick, computerPick) => {
	let resultValue = -1

	if (playerPick === computerPick) {
		resultValue = 0
	}
	else if (playerPick === 'Rock' && computerPick === 'Scissors') {
		resultValue = 1
	}
	else if (playerPick === 'Scissors' && computerPick === 'Paper') {
		resultValue = 1
	}
	else if (playerPick === 'Paper' && computerPick === 'Rock') {
		resultValue = 1
	}

	return resultValue
}

/**
 * Set result text
 * @param {number} result 
 */
const setResultText = (result) => {
	let resultMessage = 'It\'s a draw'
	if (result > 0) {
		resultMessage = 'You win'
	}
	else if (result < 0) {
		resultMessage = 'You lose'
	}

	appResult.classList.remove('hide')
	resultText.textContent = resultMessage
	appResult.focus()
}

const computerPickText = document.querySelector('.app-result__comp')

/**
 * Choose random computer pick
 */
const selectComputerPick = () => {
	const buttonsLength = 3
	const randomInd = Math.floor(Math.random() * buttonsLength)

	const computerBtn = appButtons[randomInd]
	const clonedComputerBtn = computerBtn.cloneNode(true)
	clonedComputerBtn.classList.add('picked')

	replaceElement(clonedComputerBtn, appCols[1].children[0])

	const computerPick = computerBtn.getAttribute('aria-label')

	computerPickText.textContent = `The house picked ${computerPick}`

	return computerPick
}

/**
 * Replace element
 * @param {object} newEl 
 * @param {object} currentEl 
 */
const replaceElement = (newEl, currentEl) => {
	const parentEl = currentEl.parentNode

	parentEl.insertBefore(newEl, currentEl)
	parentEl.removeChild(currentEl)
}

const stages = document.querySelectorAll('.app__stage')

/**
 * Hide all stages
 */
const hideStages = () => {
	stages.forEach(stage => {
		stage.classList.add('hide')
	})
}

const scoreValue = document.querySelector('.score__value')

/**
 * Get score value
 * > From localStorage
 * @returns {number}
 */
const getScore = () => {
	const scoreTextValue = parseInt(scoreValue.textContent)
	const scoreStorageValue = parseInt(window.localStorage.getItem('score'))

	if (scoreStorageValue && scoreTextValue !== scoreStorageValue) {
		setScore(scoreStorageValue)
	}
	/**
	 * Set localStorage 'score' value to scoreTextValue if not defined
	 */
	else if (!scoreStorageValue) {
		setScore(scoreTextValue)
	}

	return scoreStorageValue ? scoreStorageValue : scoreTextValue
}

/**
 * Set score value
 * > To localStorage
 * @param {number} value 
 */
const setScore = (value) => {
	scoreValue.textContent = getDoubleDigits(value)
	window.localStorage.setItem('score', value)
}

/**
 * Get double digits number
 * > Add preceding 0 if single digit
 * @param {number} value 
 * @returns {string}
 */
const getDoubleDigits = (value) => {
	return value > 9 || value < 0 ? `${value}` : `0${value}`
}

const modal = document.querySelector('.rules-modal')
const modalToggle = document.querySelector('.rules-modal__toggle')
const closeButtons = modal.querySelectorAll('.rules-modal__close')

/**
 * Add click event listener to .rules-modal__toggle
 */
const addListenerToModalToggle = () => {
	modalToggle.addEventListener('click', handleModalToggle)
}

const modalFigure = modal.querySelector('.rules-modal__figure')

/**
 * Handle .rules-modal__toggle click event
 * > Show modal
 */
const handleModalToggle = () => {
	modal.classList.remove('hide')
	modalFigure.focus()

	modal.addEventListener('keydown', handleModalKeydown)
}

/**
 * Handle .rules-modal keydown event
 * > Set focus trap
 * > Close modal on Esc pressed
 * @param {object} event 
 */
const handleModalKeydown = (event) => {
	const { key } = event

	if (key === 'Escape') {
		closeRulesModal()
	}
	else if (key === 'Tab') {
		const currentActiveEl = document.activeElement

		if (event.shiftKey && currentActiveEl.classList.contains('rules-modal__close')) {
			event.preventDefault()
			modalFigure.focus()
		}
		else if (!event.shiftKey && currentActiveEl === modalFigure) {
			event.preventDefault()
			closeButtons.forEach(closeBtn => {
				if (window.getComputedStyle(closeBtn).display !== 'none') {
					closeBtn.focus()
				}
			})
		}
	}
}

/**
 * Add click event listener to .rules-modal__close buttons
 */
const addListenerToModalClose = () => {
	closeButtons.forEach(closeBtn => {
		closeBtn.addEventListener('click', closeRulesModal)
	})
}

/**
 * Handle .rules-modal__close click event
 * > Close modal
 * > Return focus to toggle button
 */
const closeRulesModal = () => {
	modal.classList.add('hide')
	modalToggle.focus()
	modal.removeEventListener('keydown', handleModalKeydown)
}

const initApp = () => {
	setScore(getScore())
	addListenerToAppButtons()
	addListenerToResultBtn()
	addListenerToModalToggle()
	addListenerToModalClose()
}

initApp()