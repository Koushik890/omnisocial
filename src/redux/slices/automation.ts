import { duplicateValidation } from '@/lib/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IntialStateTriggerProps = {
    trigger?: {
        type?: 'COMMENT' | 'DM'
        keyword?: string
        types: string[]
        keywords?: string[]
        config?: {
            status: 'unconfigured' | 'partial' | 'complete'
            type: 'all' | 'specific' | 'next'
            keywords?: { include: string[] }
            replyMessages?: string[]
            posts?: Array<{
                postId: string
                mediaType: string
                mediaUrl: string
                caption?: string
            }>
        }
    }
}

const InitialState: IntialStateTriggerProps = {
    trigger: {
        type: undefined,
        keyword: undefined,
        types: [],
        keywords: [],
        config: undefined
    },
}

export const AUTOMATION = createSlice({
    name: 'automation',
    initialState: InitialState,
    reducers: {
        TRIGGER: (state, action: PayloadAction<IntialStateTriggerProps>) => {
            if (action.payload.trigger?.types !== undefined) {
                // If types array is provided, update the entire trigger state
                state.trigger = {
                    ...state.trigger,
                    ...action.payload.trigger,
                    // Ensure types is always an array
                    types: action.payload.trigger.types
                }
            } else if (action.payload.trigger?.type) {
                // If single type is provided, handle add/remove
                const newTypes = duplicateValidation(
                    state.trigger?.types || [],
                    action.payload.trigger.type
                )
                
                // Update state with all properties
                state.trigger = {
                    ...state.trigger,
                    type: action.payload.trigger.type,
                    config: action.payload.trigger.config,
                    types: newTypes
                }
            }
            return state
        },
    },
})

export const { TRIGGER } = AUTOMATION.actions
export default AUTOMATION.reducer