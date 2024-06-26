import { useContext } from 'react'
import FormControlContext, { FormControlState } from './FormControlContext'

export default function useFormControl(): FormControlState | undefined {
	return useContext(FormControlContext)
}
