import { endsWith, startCase } from 'lodash'
import pluralize from 'pluralize'

function formatLabel (label) {
  const startCased = startCase(label)
  if (endsWith(startCased, ' Ids')) {
    return pluralize(startCased.replace(/ Ids$/, ''))
  } else if (endsWith(startCased, ' Id')) {
    return startCased.replace(/ Id$/, '')
  } else {
    return startCased
  }
}

export default formatLabel
