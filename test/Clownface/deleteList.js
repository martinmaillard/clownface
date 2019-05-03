/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const ns = require('../support/namespace')
const rdf = require('../support/factory')
const { addAll } = require('../support/utils')

describe('.deleteList', () => {
  it('should be a function', () => {
    const cf = clownface()

    assert.strictEqual(typeof cf.deleteList, 'function')
  })

  it('should throw an error if predicate parameter is missing', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, subject)

    let touched = false

    try {
      cf.deleteList(null)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should remove list quads using the context term as subject and the given predicate', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/counts')
    const predicateOther = rdf.namedNode('http://schema.org/other')
    const item0 = rdf.literal('0')
    const item1 = rdf.literal('1')
    const first0 = rdf.blankNode()
    const first1 = rdf.blankNode()
    const other = rdf.quad(subject, predicateOther, item0)
    const cf = clownface(localGraph, subject)

    addAll(localGraph, [
      other,
      rdf.quad(subject, predicate, first0),
      rdf.quad(first0, ns.first, item0),
      rdf.quad(first0, ns.rest, first1),
      rdf.quad(first1, ns.first, item1),
      rdf.quad(first1, ns.rest, ns.nil)
    ])

    cf.deleteList(predicate)

    assert.strictEqual(localGraph.size, 1)
    assert([...localGraph][0].equals(other))
  })
})
