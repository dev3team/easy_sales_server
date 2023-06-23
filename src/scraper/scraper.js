const loadCoverLetterTemplate = require('./utils/loadCoverLetterTemplate');

const SELECTOR_COUNTRY = 'ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li[data-qa="client-location"] > strong';
const SELECTOR_CITY = 'ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li[data-qa="client-location"] .text-muted span';
const SELECTOR_REVIEWS = 'div.cfe-ui-job-about-client > div.text-muted.rating.mb-20 > span';
const SELECTOR_HIRE_RATE = 'ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li[data-qa="client-job-posting-stats"] > div.text-muted';
const SELECTOR_CLIENT_SPENT = 'div.cfe-ui-job-about-client ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom strong[data-qa="client-spend"] > span > span';
const SELECTOR_CLIENT_HIRES = 'div.cfe-ui-job-about-client ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom div[data-qa="client-hires"]';
const SELECTOR_AVG_HOURLY_RATE_PAID = 'div.cfe-ui-job-about-client ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li strong[data-qa="client-hourly-rate"]';
const SELECTOR_HOURLY_RATE = '.up-card-section [data-cy="clock-timelog"] + div > div';
const SELECTOR_FIXED_PRICE = '.up-card-section [data-test="job-budget"] strong';
const SELECTOR_EXPERTISE = 'section.up-card-section ul.cfe-ui-job-features.p-0 li div.header div[data-cy="expertise"] + strong';
const SELECTOR_APPLY_BUTTON = 'button[aria-label="Apply Now"]';
const SELECTOR_MODAL_BUTTON = 'div.up-modal-footer button.up-btn.up-btn-primary';
const SELECTOR_TERMS_BUDGET = 'div.fe-proposal-job-terms h5.pull-right.m-0.d-none.d-md-block.text-right span';
const SELECTOR_TERMS_FIXED_JOB = '.fe-proposal-job-terms legend';
const SELECTOR_TERMS_HOURLY_JOB = 'div.fe-proposal-job-terms h3.mb-20';
const SELECTOR_DURATION_Q = '.fe-proposal-job-estimated-duration #duration-label';
const SELECTOR_ADDITIONAL_DETAILS_SECTION = '.fe-proposal-additional-details.additonal-details';
const SELECTOR_COVER_LETTER = '.fe-proposal-additional-details.additonal-details .cover-letter-area';
const SELECTOR_JOB_QUESTIONS_AREA = '.fe-proposal-additional-details.additonal-details div.fe-proposal-job-questions.questions-area';
const SELECTOR_QUESTIONS = '.fe-proposal-additional-details.additonal-details div.fe-proposal-job-questions.questions-area label';
const SELECTOR_ATTACHMENTS_BUTTON = '.fe-proposal-additional-details.additonal-details div.attachments-area.mt-20 button.up-btn-link';
// const SELECTOR_DURATION = '.fe-proposal-job-estimated-duration div.up-dropdown-icon.up-icon';
const SELECTOR_DURATION = '.fe-proposal-job-estimated-duration .up-dropdown';
const SELECTOR_HOURLY_RATE_INPUT = '.fe-proposal-job-terms input#step-rate';
const SELECTOR_DURATION_OPTION= '.fe-proposal-job-estimated-duration .up-menu-container li.up-menu-item';
const SELECTOR_RADIO_INPUT = '.fe-proposal-job-terms .up-radio input';
const SELECTOR_BY_PROJECT_INPUT = '.fe-proposal-job-terms input#charged-amount-id';
const SELECTOR_ADD_MILESTONE_BUTTON = '.up-fe-milestones button.up-btn-link.milestone-add';
const SELECTOR_DESCRIPTION_INPUT = '.up-fe-milestones input[data-test="milestone-description"]';
const SELECTOR_AMOUNT_INPUT = '.up-fe-milestone-amount input';
const SELECTOR_COVER_LETTER_TEXTAREA = '.fe-proposal-additional-details.additonal-details textarea.up-textarea';
const SELECTOR_BIDS = 'table.up-table.up-table-bordered > tbody > tr > td:nth-child(2)';
const SELECTOR_SET_BID_BUTTON = '.fe-proposal-boost-proposal button.up-btn.up-btn-default.m-0';
const SELECTOR_BID_INPUT = '.fe-proposal-boost-proposal #boost-bid-amount';
const SELECTOR_BID_BUTTON = '.fe-proposal-boost-proposal .up-btn.up-btn-default.up-btn-sm.m-0';
const SELECTOR_QUESTIONS_TEXTAREA = '.fe-proposal-job-questions.questions-area .up-textarea';
const SELECTOR_TEAM = '';
const SELECTOR_TEAM_OPTION = '';
const SELECTOR_FREELANCER = '';
const SELECTOR_FREELANCER_OPTION = '';
const SELECTOR_SUBMIT_PROPOSAL = 'footer button.up-btn.up-btn-primary.m-0';
const SELECTOR_SUCCESS_NOTIFICATION = '.up-alert.up-alert-success.up-alert-inline p';
const SELECTOR_CONNECTS = 'aside.up-sidebar div[data-test="connects-auction"]>div:nth-child(1)';
const SELECTOR_AVAILABLE_CONNECTS = 'aside.up-sidebar div[data-test="connects-auction"]>div:nth-child(2)';
const SELECTOR_MILESTONE_SECTION = '.fe-proposal-job-terms #milestoneMode';

const scraper = {
    getReviews: async (page) => {
        const data = {average_rating: null, reviews: null}
        try {
            const value = await page.$eval(SELECTOR_REVIEWS, el => el.innerHTML);
            const arrReviews = value.split('of').map(str => +str.replace(/[^\d\.]*/g, ''));
            data.average_rating = arrReviews[0];
            data.reviews = arrReviews[1]
        } catch (error) {
            // console.log(error.message)
        }
        return data
    },

    getClientLocation: async (page) => {
        const location = {country: null, city: null};
        try {
            const country = await page.$eval(SELECTOR_COUNTRY, el => el.innerHTML);
            location.country = country.trim();
            const city = await page.$eval(SELECTOR_CITY, el => el.innerHTML)
            location.city = city.trim();
        } catch (error) {
            // console.log(error.message)
        }
        return location
    },

    getJobInfo: async (page) => {
        const data = {hire_rate: null, open_job: null}
        try {
            const value = await page.$eval(SELECTOR_HIRE_RATE, el => el.innerHTML);
            const arrOfValue = value.split('rate').map(str => +str.replace(/[^\d\.]*/g, ''));
            data.hire_rate = arrOfValue[0] + '%';
            data.open_job = arrOfValue[1];
        } catch (error) {
            // console.log(error.message)
        }
        return data
    }, 

    getClientSpendInfo: async(page) => {
        try {
            const value = await page.$eval(SELECTOR_CLIENT_SPENT, el => el.innerHTML);
            return value.trim() || null
        } catch (error) {
            // console.log(error.message);
            return null
        }
    },

    getClientHires: async(page) => {
        const data = {client_hires: null, active: null};
        try {
            const value = await page.$eval(SELECTOR_CLIENT_HIRES, el => el.innerHTML);
            const arrOfClientHires = value.split(',').map(str => +str.replace(/[^\d\.]*/g, ''));
            data.client_hires = arrOfClientHires[0];
            data.active = arrOfClientHires[1];
        } catch (error) {
            // console.log(error.message);
        }
        return data
    },

    getAvgHourlyRatePaid: async(page) => {
        try {
            const value = await page.$eval(SELECTOR_AVG_HOURLY_RATE_PAID, el => el.textContent);
            return +value?.replace(/[^\d\.]*/g, '')
        } catch (error) {
            // console.log(error.message);
            return null
        }
    },

    getHourlyRate: async (page) => {
        try {
            const value = await page.$eval(SELECTOR_HOURLY_RATE, el => el.textContent);
            return value.replace(/(\r\n|\n|\r)/gm, "").split(" ").join("");
        } catch (error) {
            // console.log(error.message);
            return null
        }
    },
    getFixedPrice: async (page) => {
        try {
            const value = await page.$eval(SELECTOR_FIXED_PRICE, el => el.textContent);
            return value.trim();
        } catch (error) {
            // console.log(error.message);
            return null
        }
    },
    getExpertise: async (page) => {
        try {
            const value = await page.$eval(SELECTOR_EXPERTISE, el => el.textContent);
            return value.trim();
        } catch (error) {
            // console.log(error.message);
            return null
        }
    },
    login: async (page, user) => {
        console.log('redirect to login page...');
        try {
            await page.waitForSelector('#nav-main > div > a.nav-item.login-link.d-none.d-lg-block.px-20');
            await page.click('#nav-main > div > a.nav-item.login-link.d-none.d-lg-block.px-20');
            await page.waitForNavigation({waitUntil: 'domcontentloaded'});
            await page.waitForSelector('input#login_username.up-input');
            await page.type('input#login_username.up-input', user.username);
            await page.click('#login_password_continue');
            await page.waitForSelector('input#login_password.up-input');
            await page.type('input#login_password.up-input', user.password);
            await page.click('#login_control_continue');
        } catch (error) {
            console.log(error.message);
        }
    },
    closeModal: async (page) => {
        try {
            await page.waitForSelector(SELECTOR_MODAL_BUTTON, {timeout: 2000})
            await page.click(SELECTOR_MODAL_BUTTON);
        } catch (error) {
            console.log(error.message)
        }
    },
    clickApply: async(page) => {
        try {
            await scraper.closeModal(page)
            await page.waitForSelector(SELECTOR_APPLY_BUTTON, {timeout:3000});
            await page.click(SELECTOR_APPLY_BUTTON);
        } catch (error) {
            console.log(error.message)
        }
    },
    checkAvailableConnects: async(page) => {
        const data = {requiredConnects: null, availableConnects: null};
        try {
            await page.waitForSelector(SELECTOR_CONNECTS, {timeout:5000});
            const requiredConnects = await page.$eval(SELECTOR_CONNECTS, el => el.innerHTML);
            if(requiredConnects){
                data.requiredConnects = requiredConnects.replace(/[^\d\.]*/g, '')
            }
            const availableConnects = await page.$eval(SELECTOR_AVAILABLE_CONNECTS, el => el.innerHTML);
            if(availableConnects){
                data.availableConnects = availableConnects.replace(/[^\d\.]*/g, '');
            }
            return data
        } catch (error) {
            console.log(error.message)
        }
    },

    

    getTerms: async(page, jobType) => {
        let terms = {jobType}
        try {
            if(jobType == "Fixed") {
                // await page.waitForSelector(SELECTOR_MILESTONE_SECTION, {timeout:5000});
                const milestoneSection = await page.$(SELECTOR_MILESTONE_SECTION);
                milestoneSection ? terms.milestone = true : terms.milestone = false
            }
            return terms
        } catch (error) {
            console.log(error.message)
        }
    },
    // getBudget: async (page) => {
    //     try {
    //         await page.waitForTimeout(3000)
    //         const value = await page.$eval(SELECTOR_TERMS_BUDGET, el => el.textContent);
    //         const budget = value.split(':')[1];
    //         return budget.trim();
    //     } catch (error) {
    //         console.log(error.message)
    //         return null
    //     }
    // },
    // termsQuestions: {
    //     getFixedPrice: async (page) => {
    //         try {
    //             // await page.waitForSelector(SELECTOR_TERMS_FIXED_JOB);
    //             const value = await page.$eval(SELECTOR_TERMS_FIXED_JOB, el => el.textContent);
    //             return value.trim();
    //         } catch (error) {
    //             console.log(error.message)
    //             return null
    //         }
    //     },
    //     getHourlyRate: async (page) => {
    //         try {
    //             // await page.waitForSelector(SELECTOR_TERMS_HOURLY_JOB);
    //             const value = await page.$eval(SELECTOR_TERMS_HOURLY_JOB, el => el.textContent);
    //             return value.trim();
    //         } catch (error) {
    //             console.log(error.message)
    //             return null
    //         }
    //     }
    // },
    getDurationQuestion: async (page) => {
        try {
            await page.waitForSelector(SELECTOR_DURATION_Q, {timeout: 2000});
            const value = await page.$eval(SELECTOR_DURATION_Q, el => el.textContent);
            if(value) return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    },
    // getAdditionalDetails: async (page) => {
    //     let additionalDetails = {};
    //     try {
    //         cosnt 
    //     } catch (error) {
            
    //     }
    // },

    // checkAdditionalSection: async (page) => {
    //     let additionalDetails = {}
    //     try {
    //         // const value = await page.$eval(SELECTOR_ADDITIONAL_DETAILS_SECTION, el => el.textContent);
    //         await page.waitForSelector(SELECTOR_ADDITIONAL_DETAILS_SECTION)
    //         // const isCover = await scraper.checkCoverLetterArea(page);
    //         additionalDetails.isCover = isCover;
    //         const jobQuestions = await scraper.getJobQuestions(page);
    //         additionalDetails.jobQuestions = jobQuestions;
    //         // const isAttachmentsArea = await scraper.checkAttachmentsArea(page);
    //         // additionalDetails.isAttachmentsArea = isAttachmentsArea
    //     } catch (error) {
    //         console.log(error.message)
    //         return null
    //     }
    //     return additionalDetails
    // },
    // checkCoverLetterArea: async (page) => {
    //     try {
    //         const value = await page.$eval(SELECTOR_COVER_LETTER, el => el.textContent);
    //         if (value) return true
    //     } catch (error) {
    //         console.log(error.message)
    //         return false
    //     }
    // },
    getJobQuestions: async (page) => {
        try {
            // const area = await page.$(SELECTOR_JOB_QUESTIONS_AREA);
            // if (!area) return [];
            // await page.waitForSelector(SELECTOR_JOB_QUESTIONS_AREA);
            // await page.$eval(SELECTOR_JOB_QUESTIONS_AREA, el => el.textContent);
            const values = await page.$$eval(SELECTOR_QUESTIONS, el => el.map(item => item.textContent.trim()));
            return values;
        } catch (error) {
            console.log(error.message)
            return null
        }
    },
    // checkAttachmentsArea: async (page) => {
    //     try {
    //         const attachmentsButton = await page.$eval(SELECTOR_ATTACHMENTS_BUTTON, el => el.textContent);
    //         if(attachmentsButton) return true;
    //     } catch (error) {
    //         console.log(error.message)
    //         return false
    //     }
    // },
    setDuration: async (page, data) => {
        try {
            // await page.waitForSelector(SELECTOR_DURATION);
            const dropDown = await page.$(SELECTOR_DURATION);
            await dropDown.click();
            await page.waitForTimeout(1000)
            await page.waitForSelector(SELECTOR_DURATION_OPTION);
            const values = await page.$$eval(SELECTOR_DURATION_OPTION, el => el.map(item => {
                return item.textContent.trim()
            }))

            const index = values.findIndex(item => item == data);
            const elements = await page.$$(SELECTOR_DURATION_OPTION);
            await elements[index].click();

        } catch (error) {
            console.log(error.message)
        }
    },
    setHourlyRate: async(page, value) => {
        try {
            await page.waitForSelector(SELECTOR_HOURLY_RATE_INPUT);
            const input = await page.$(SELECTOR_HOURLY_RATE_INPUT);
            await input.click({ clickCount: 3 });
            await input.type(value);
        } catch (error) {
            console.log(error.message)
        }
    },
    setFixedPrice: async (page, data) => {
        const activeRadio = data.filter(item => item.active)[0];
        try {
            const radioInputs = await page.$$(SELECTOR_RADIO_INPUT);
            if (radioInputs.length == 0) return await scraper.setFixedPriceByProject(page, activeRadio.value);
            if (activeRadio.type == 'milestone'){
                await radioInputs[0].click();
                await scraper.setFixedPriceByMilestone(page, activeRadio.value)
            } else {
                await radioInputs[1].click();
                await scraper.setFixedPriceByProject(page, activeRadio.value);
            } 
        } catch (error) {
            console.log(error.message)
        }
    },
    setFixedPriceByProject: async(page, value) => {
        try {
            await page.waitForSelector(SELECTOR_BY_PROJECT_INPUT);
            const input = await page.$(SELECTOR_BY_PROJECT_INPUT);
            await input.click({ clickCount: 3 })
            await input.type(value);
        } catch (error) {
            console.log(error.message)
        }
    },
    setFixedPriceByMilestone: async(page, values) => {
        try {
            for(let i = 0; i < values.length; i++){
                await scraper.setMilestone(page, values[i]);
                if (values.length - i > 1){
                    const btnAddMilestone = await page.$(SELECTOR_ADD_MILESTONE_BUTTON);
                    await btnAddMilestone.click();
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    },
    setMilestone: async(page, value) => {
        try {
            const inputsAmount = await page.$$(SELECTOR_AMOUNT_INPUT);
            const lastInputAmount = inputsAmount[inputsAmount.length-1];
            await lastInputAmount.type(value.amount);
            const inputsDescr = await page.$$(SELECTOR_DESCRIPTION_INPUT);
            const lastInputDescr = inputsDescr[inputsDescr.length-1];
            await lastInputDescr.type(value.description);
        } catch (error) {
            console.log(error.message)
        }
    },
    setCoverLetter: async(page, value) => {
        try {
            await page.waitForSelector(SELECTOR_COVER_LETTER_TEXTAREA);
            const letter = loadCoverLetterTemplate(value);
            const coverLetterTextarea = await page.$(SELECTOR_COVER_LETTER_TEXTAREA);
            await coverLetterTextarea.type(letter)
        } catch (error) {
            console.log(error.message)
        }
    },
    getBids: async (page) => {
        try {
            await page.waitForSelector(SELECTOR_BIDS, {timeout: 3000});
            const values = await page.$$eval(SELECTOR_BIDS, el => el.map(item => {
                return item.textContent.trim().split('.')[0];
            }))
            return values
        } catch (error) {
            return null
            console.log(error.message)
        }
    },
    setBids: async (page, value) => {
        try {
            await page.waitForSelector(SELECTOR_SET_BID_BUTTON, {timeout: 2000});
            await page.click(SELECTOR_SET_BID_BUTTON);
            await page.waitForSelector(SELECTOR_BID_INPUT);
            const input = await page.$(SELECTOR_BID_INPUT);
            await input.click({ clickCount: 3 })
            await input.type(value);
            await page.waitForSelector(SELECTOR_BID_BUTTON);
            await page.click(SELECTOR_BID_BUTTON);
        } catch (error) {
            console.log(error.message)
        }
    },
    setAnswers: async(page, values) => {
        try {
            await page.waitForSelector(SELECTOR_QUESTIONS_TEXTAREA);
            const textareas = await page.$$(SELECTOR_QUESTIONS_TEXTAREA);
            for(let i = 0; i < values.length; i++) {
                await textareas[i].type(values[i]);
            }
        } catch (error) {
            console.log(error.message)
        }
    },
    setTeam: async (page, value) => {
        try {
            await page.waitForSelector(SELECTOR_TEAM);
            await page.click(SELECTOR_TEAM);
            await page.waitForSelector(SELECTOR_TEAM_OPTION);
            const values = await page.$$eval(SELECTOR_TEAM_OPTION, el => el.map(item => {
                return item.textContent.trim()
            }))

            const index = values.findIndex(item => item == value);
            const elements = await page.$$(SELECTOR_TEAM_OPTION);
            await elements[index].click();
        } catch (error) {
            console.log(error.message)
        }
    },
    setFreelancer: async(page, value) => {
        try {
            await page.waitForSelector(SELECTOR_FREELANCER);
            await page.click(SELECTOR_FREELANCER);
            await page.waitForSelector(SELECTOR_FREELANCER_OPTION);
            const values = await page.$$eval(SELECTOR_FREELANCER_OPTION, el => el.map(item => {
                return item.textContent.trim()
            }))

            const index = values.findIndex(item => item == value);
            const elements = await page.$$(SELECTOR_FREELANCER_OPTION);
            await elements[index].click();
        } catch (error) {
            console.log(error.message)
        }
    },
    checkIsAvailableJob: async(page) => {
        try {
            return await page.$(SELECTOR_APPLY_BUTTON) ? true : false;
        } catch (error) {
            console.log(error.message)
        }
    },
    submitProposal: async (page) => {
        try {
            await page.waitForSelector(SELECTOR_SUBMIT_PROPOSAL, {timeout: 1000});
            const button = await page.$(SELECTOR_SUBMIT_PROPOSAL);
            await button.click();
        } catch (error) {
            console.log(error.message, "error submitProposal")
        }
    },
    getSuccessNotification: async (page) => {
        try {
            await page.waitForNavigation({waitUntil: 'load'})
            await page.waitForSelector(SELECTOR_SUCCESS_NOTIFICATION, {timeout: 8000});
            const value = await page.$eval(SELECTOR_SUCCESS_NOTIFICATION, el => el.textContent);
            return value
        } catch (error) {
            console.log(error.message, "error => getSuccessNotification")
            return error.message
        }
    },
};

module.exports = scraper;

